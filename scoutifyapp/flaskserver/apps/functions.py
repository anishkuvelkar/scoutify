import re
import csv
import os
from datetime import datetime
from googleapiclient.discovery import build
import io
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, request, jsonify
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from google.generativeai import GenerativeModel
import google.generativeai as genai 
from googleapiclient.errors import HttpError
from fpdf import FPDF


def get_channel_data(artist_link, api_key):
    youtube = build("youtube", "v3", developerKey=api_key)
    handle_match = re.search(r"youtube\.com/@([\w-]+)", artist_link)
    if not handle_match:
        raise ValueError("❌ Invalid channel URL format")
    handle = handle_match.group(1)
    print(f"🔹 Extracted handle: {handle}")
    try:
        response = youtube.search().list(part="snippet", type="channel", q=handle).execute()
    except HttpError as e:
        if e.resp.status == 403:
            print("❌ API Quota Exceeded! YouTube API limit reached.")
            raise ValueError("❌ API Quota Exceeded! Try again later.")
        print(f"❌ API Error: {e}")
        raise
    if not response.get('items'):
        raise ValueError("❌ Channel not found")
    channel_id = response['items'][0]['snippet']['channelId']
    print(f"✅ Found Channel ID: {channel_id}")
    try:
        channel_response = youtube.channels().list(part="snippet,statistics,contentDetails", id=channel_id).execute()
    except HttpError as e:
        if e.resp.status == 403:
            print("❌ API Quota Exceeded while fetching channel details!")
            raise ValueError("❌ API Quota Exceeded! Try again later.")
        print(f"❌ API Error: {e}")
        raise
    if "items" not in channel_response or not channel_response["items"]:
        raise ValueError("❌ No channel details found")
    channel_info = channel_response["items"][0]
    channel_name = channel_info["snippet"]["title"]
    subscriber_count = channel_info["statistics"]["subscriberCount"]  
    # ✅ Fetch profile picture URL
    profile_picture_url = channel_info["snippet"]["thumbnails"]["high"]["url"]
    print(f"✅ Profile Picture URL: {profile_picture_url}")
    uploads_playlist_id = channel_info["contentDetails"]["relatedPlaylists"]["uploads"]
    print(f"✅ Uploads Playlist ID: {uploads_playlist_id}")
    videos, next_page_token = [], None
    while True:
        try:
            playlist_response = youtube.playlistItems().list(
                part="snippet,contentDetails", playlistId=uploads_playlist_id, maxResults=50, pageToken=next_page_token
            ).execute()
        except HttpError as e:
            if e.resp.status == 403:
                print("❌ API Quota Exceeded while fetching videos!")
                raise ValueError("❌ API Quota Exceeded! Try again later.")
            print(f"❌ API Error: {e}")
            raise
        if "items" not in playlist_response or not playlist_response["items"]:
            print("❌ No videos found in the playlist!")
            break
        for item in playlist_response["items"]:
            title = item["snippet"]["title"]
            published_datetime = datetime.strptime(item["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
            video_id = item["contentDetails"]["videoId"]
            try:
                video_response = youtube.videos().list(part="statistics", id=video_id).execute()
            except HttpError as e:
                if e.resp.status == 403:
                    print("❌ API Quota Exceeded while fetching video statistics!")
                    raise ValueError("❌ API Quota Exceeded! Try again later.")
                print(f"❌ API Error: {e}")
                raise
            stats = video_response["items"][0]["statistics"] if video_response.get("items") else {}
            view_count = int(stats.get("viewCount", 0))
            like_count = int(stats.get("likeCount", 0))
            videos.append((title, published_datetime.year, published_datetime.strftime("%B"), view_count, like_count))
        next_page_token = playlist_response.get("nextPageToken")
        if not next_page_token:
            break
    if not videos:
        print("❌ No videos collected!")
    print(f"✅ Collected {len(videos)} videos.")
    return channel_name, subscriber_count, profile_picture_url, videos  

def analyze_video_data(df, channel_name, subscriber_count):
    if df.empty:
        return {"error": "No video data available for processing"}
    month_to_number = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
    }
    df["Month"] = df["Month"].map(month_to_number)
    df_sorted = df.sort_values(by=["Year", "Month"]).reset_index(drop=True)
    df_monthly = df_sorted.groupby(["Year", "Month"])[["Views", "Likes"]].sum().reset_index()
    df_yearly = df_sorted.groupby("Year")[["Views", "Likes"]].sum().reset_index()
    most_viewed_song = df_sorted.loc[df_sorted["Views"].idxmax()]
    most_liked_song = df_sorted.loc[df_sorted["Likes"].idxmax()]
    month_numbers_to_names = {v: k for k, v in month_to_number.items()}
    output_content = [
        f" Channel Name: {channel_name}",
        f" Subscriber Count: {subscriber_count}",
        f"\n Most Viewed Song:\n    Title: {most_viewed_song['Title']}\n    Year: {most_viewed_song['Year']}\n    Views: {most_viewed_song['Views']:,}\n    Likes: {most_viewed_song['Likes']:,}",
        f"\n Most Liked Song:\n    Title: {most_liked_song['Title']}\n    Year: {most_liked_song['Year']}\n    Views: {most_liked_song['Views']:,}\n    Likes: {most_liked_song['Likes']:,}"
    ]
    for i in range(1, len(df_monthly)):
        current, previous = df_monthly.iloc[i], df_monthly.iloc[i - 1]
        if current["Year"] == previous["Year"]:
            output_content.append(f" Growth from {month_numbers_to_names[previous['Month']]} to {month_numbers_to_names[current['Month']]} ({current['Year']}): {current['Views'] - previous['Views']:,} views, {current['Likes'] - previous['Likes']:,} likes.")
    for i in range(1, len(df_yearly)):
        current_year, previous_year = df_yearly.iloc[i], df_yearly.iloc[i - 1]
        output_content.append(f" Growth from {previous_year['Year']} to {current_year['Year']}: {current_year['Views'] - previous_year['Views']:,} views, {current_year['Likes'] - previous_year['Likes']:,} likes.")
    X, y_views, y_likes = df_yearly["Year"].values.reshape(-1, 1), df_yearly["Views"].values, df_yearly["Likes"].values
    if len(X) > 1:
        model_views, model_likes = LinearRegression().fit(X, y_views), LinearRegression().fit(X, y_likes)
        for year in range(df_yearly["Year"].max() + 1, df_yearly["Year"].max() + 6):
            output_content.append(f" Predicted for {year}: {int(model_views.predict([[year]])[0]):,} views, {int(model_likes.predict([[year]])[0]):,} likes.")
    print("\n".join(output_content))
    return output_content

def prepare_data(df):  
    month_to_number = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
    }
    df["Month"] = df["Month"].map(month_to_number)
    df_sorted = df.sort_values(["Year", "Month"]).reset_index(drop=True)
    df_monthlyforeachyear = df_sorted.groupby(["Year", "Month"])[["Views", "Likes"]].sum().reset_index()
    df_yearly = df_sorted.groupby("Year")[["Views", "Likes"]].sum().reset_index()
    return df_monthlyforeachyear, df_yearly

def analyze_and_plot(df, channel_name):
    df_monthlyforeachyear, df_yearly = prepare_data(df)
    X = df_yearly["Year"].values.reshape(-1, 1)
    y_views = df_yearly["Views"].values
    y_likes = df_yearly["Likes"].values
    model_views = LinearRegression()
    model_likes = LinearRegression()
    model_views.fit(X, y_views)
    model_likes.fit(X, y_likes)
    last_year = df_yearly["Year"].max()
    future_years = np.array([last_year + i for i in range(1, 6)]).reshape(-1, 1)
    predicted_views = model_views.predict(future_years)
    predicted_likes = model_likes.predict(future_years)
    sns.set(style="whitegrid")
    plot_dir_base = f'{channel_name}_plots'
    plot_dir = plot_dir_base
    counter = 1
    while os.path.exists(plot_dir):
        plot_dir = f"{plot_dir_base}_{counter}"
        counter += 1
    os.makedirs(plot_dir)

    # Plot 1: Predicted Views and Likes for the Next 5 Years
    plt.figure(figsize=(10, 6))
    plt.plot(df_yearly["Year"], df_yearly["Views"], label="Actual Views", color="b")
    plt.plot(df_yearly["Year"], df_yearly["Likes"], label="Actual Likes", color="g")
    plt.plot(future_years.flatten(), predicted_views, label="Predicted Views", color="blue", linestyle="--")
    plt.plot(future_years.flatten(), predicted_likes, label="Predicted Likes", color="green", linestyle="--")
    plt.title("Predicted Views and Likes for the Next 5 Years")
    plt.xlabel("Year")
    plt.ylabel("Count")
    plt.legend()
    plt.xticks(df_yearly["Year"].tolist() + future_years.flatten().tolist())
    plt.grid(True)
    plot_path = os.path.join(plot_dir, 'predicted_views_likes.png')
    plt.savefig(plot_path)
    plt.close()

    # Plot 2: Year-to-Year Growth for Views
    year_to_year_growth_views = [(f"{df_yearly.iloc[i - 1]['Year']} to {df_yearly.iloc[i]['Year']}", df_yearly.iloc[i]["Views"] - df_yearly.iloc[i - 1]["Views"]) for i in range(1, len(df_yearly))]
    year_growth_df_views = pd.DataFrame(year_to_year_growth_views, columns=["Year Transition", "Views Growth"])
    plt.figure(figsize=(10, 6))
    year_growth_df_views.plot(x="Year Transition", y="Views Growth", kind="bar", color="b", title="Year-to-Year Growth for Views")
    plt.ylabel("Views Growth")
    plt.xticks(rotation=45)
    plt.grid(True)
    plot_path = os.path.join(plot_dir, 'year_growth_views.png')
    plt.savefig(plot_path)
    plt.close()

    # Plot 3: Year-to-Year Growth for Views and Likes (Combined)
    year_to_year_growth_likes = [(f"{df_yearly.iloc[i - 1]['Year']} to {df_yearly.iloc[i]['Year']}", df_yearly.iloc[i]["Likes"] - df_yearly.iloc[i - 1]["Likes"]) for i in range(1, len(df_yearly))]
    year_growth_df_likes = pd.DataFrame(year_to_year_growth_likes, columns=["Year Transition", "Likes Growth"])
    fig, ax1 = plt.subplots(figsize=(10, 6))
    ax1.bar(year_growth_df_views["Year Transition"], year_growth_df_views["Views Growth"], color="b", alpha=0.6)
    ax2 = ax1.twinx()
    ax2.plot(year_growth_df_likes["Year Transition"], year_growth_df_likes["Likes Growth"], color="g", marker="o", linestyle="--")
    ax1.set_xlabel("Year Transition")
    ax1.set_ylabel("Views Growth", color="b")
    ax2.set_ylabel("Likes Growth", color="g")
    plt.title("Year-to-Year Growth for Views and Likes")
    plt.xticks(rotation=45)
    plt.grid(True)
    plot_path = os.path.join(plot_dir, 'year_growth_combined.png')
    plt.savefig(plot_path)
    plt.close()

    # Plot 4: Scatter Plot: Views vs Likes
    plt.figure(figsize=(8, 6))
    plt.scatter(df_yearly["Views"], df_yearly["Likes"], color="purple", alpha=0.6)
    plt.title("Scatter Plot: Views vs Likes")
    plt.xlabel("Views")
    plt.ylabel("Likes")
    plt.grid(True)
    plot_path = os.path.join(plot_dir, 'views_vs_likes.png')
    plt.savefig(plot_path)
    plt.close()

    # Plot 5: Yearly Summary of Views and Likes
    plt.figure(figsize=(10, 6))
    df_yearly.set_index("Year")[["Views", "Likes"]].plot(kind="bar", alpha=0.7)
    plt.title("Yearly Summary of Views and Likes")
    plt.ylabel("Count")
    plt.grid(True)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plot_path = os.path.join(plot_dir, 'yearly_summary.png')
    plt.savefig(plot_path)
    plt.close()

    return plot_dir


def generate_pdf_report(channel_name, insights,plots_dir,api_key, profile_picture_url, subscriber_count):
    """Generates a PDF report with insights and AI-generated analysis."""

    print("🔹 Starting PDF report generation...")

    try:
        print("🔹 Checking insights data type...")
        if isinstance(insights, list):  
            insights = "\n".join(map(str, insights))  # Convert list to string
        
        if not isinstance(insights, str):  
            raise ValueError("❌ 'insights' must be a string or list of strings.")

        print(f"🔹 Insights processed: {insights[:100]}...")  # Print first 100 characters
        
        print(f"🔹 Configuring AI model with provided API key...")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""Analyze the following YouTube channel insights for '{channel_name}':  
        {insights}  

        1. Background Research: Gather recent information about the artist from the internet, including their musical style, latest releases, public reception, and any notable news.  

        2. Data Analysis: Review the provided insights to identify key trends — such as audience growth, engagement rates, peak performance periods, and content types driving the most views and interactions.  

        3. Strengths and Weaknesses: Highlight the artist’s strengths (e.g., viral content, loyal fanbase, strong engagement) and weaknesses (e.g., inconsistent uploads, weak audience retention, low subscriber conversion).  

        4. Strategic Recommendations: Provide tailored strategies to enhance their online presence, such as content ideas, collaboration opportunities, platform diversification, or optimized posting schedules.  

        5. Label Evaluation: Based on the data and the artist’s trajectory, give a professional recommendation on whether the artist shows potential for a record label signing. Consider factors like marketability, growth potential, and fan engagement.
        """

        print(f"🔹 Generating content with prompt:\n{prompt}")

        response = model.generate_content(prompt)
        ai_analysis = response.text
        print("✅ AI analysis generated successfully.")

    except Exception as e:
        print(f"❌ Error generating content: {e}")
        return None

    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        print("🔹 PDF object created and configured.")

        # Add title
        pdf.cell(200, 10, txt=f"{channel_name} YouTube Channel Analysis Report", ln=True, align="C")
        pdf.ln(10)
        print("🔹 Added report title.")

        # Add insights summary
        print("🔹 Adding insights summary...")
        pdf.cell(200, 10, txt="Insights Summary:", ln=True, align="L")
        pdf.multi_cell(0, 10, txt=insights, align="L")
        pdf.ln(10)
        print("✅ Added insights summary.")

        # Add AI-generated analysis
        print("🔹 Adding AI-generated analysis...")
        pdf.cell(200, 10, txt="AI-Generated Analysis and Recommendations:", ln=True, align="L")
        pdf.multi_cell(0, 10, txt=ai_analysis, align="L")
        pdf.ln(10)
        print("✅ Added AI-generated analysis.")

        # Add images from the plots directory
        if os.path.exists(plots_dir):
            print(f"🔹 Plot directory found: {plots_dir}")
            for plot_file in sorted(os.listdir(plots_dir)):
                if plot_file.endswith(".png"):
                    img_path = os.path.join(plots_dir, plot_file)
                    if os.path.exists(img_path):
                        pdf.ln(5)
                        print(f"🔹 Adding image: {img_path}")
                        pdf.image(img_path, x=10, w=170)
                        pdf.ln(10)
                    else:
                        print(f"❌ Missing image: {img_path}")
                        pdf.cell(200, 10, txt=f"❌ Missing image: {img_path}", ln=True, align="L")
        else:
            print("❌ Plot directory not found.")
            pdf.cell(200, 10, txt="Plot directory not found.", ln=True, align="L")

        # Save the PDF to a byte stream instead of a file
        pdf_output = io.BytesIO()
        pdf_bytes = pdf.output(dest='S').encode('latin1')  # Convert PDF output to bytes
        pdf_output.write(pdf_bytes)
        pdf_output.seek(0)


        return pdf_output, channel_name, profile_picture_url, subscriber_count

    except Exception as e:
        print(f"❌ PDF generation failed: {e}")
        return None