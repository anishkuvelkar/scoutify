import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from functions import get_channel_data, analyze_video_data, analyze_and_plot, generate_pdf_report
import pandas as pd
from googleapiclient.errors import HttpError
import base64
from threading import Timer

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
API_KEY = os.getenv("YOUTUBE_API_KEY")

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GENERATED_FILES_DIR = os.path.join(BASE_DIR, 'generated_files')
PDF_DIR = os.path.join(BASE_DIR, 'pdf_files')

os.makedirs(GENERATED_FILES_DIR, exist_ok=True)
os.makedirs(PDF_DIR, exist_ok=True)


def restart_server():
    """Restart the Flask server."""
    print("🔄 Restarting server...")
    os.execv(sys.executable, [sys.executable] + sys.argv)


@app.route('/analysis', methods=['POST'])
def analyze():
    print("🔹 Analysis endpoint hit.")
    
    data = request.json
    artist_link = data.get("artistLink")

    if not artist_link:
        Timer(1.0, restart_server).start()
        return jsonify({"error": "Artist link is required"}), 400

    try:
        # Fetch channel and video data
        channel_name, subscriber_count, profile_picture_url, videos = get_channel_data(artist_link, API_KEY)

        if not videos:
            Timer(1.0, restart_server).start()
            return jsonify({"error": "No videos found"}), 400
            
        # Convert video data to DataFrame and analyze
        df = pd.DataFrame(videos, columns=["Title", "Year", "Month", "Views", "Likes"])
        plots_dir = analyze_and_plot(df, channel_name)
        insights = analyze_video_data(df, channel_name, subscriber_count)

        # Generate PDF report
        pdf_output, channel_name, profile_picture_url, subscriber_count = generate_pdf_report(
            channel_name, insights, plots_dir, api_key, profile_picture_url, subscriber_count
        )

        if pdf_output is None:
            Timer(1.0, restart_server).start()
            return jsonify({"error": "Failed to generate PDF report."}), 500

        # Encode PDF as base64
        pdf_base64 = base64.b64encode(pdf_output.getvalue()).decode('utf-8')

        # Prepare response
        response = {
            "channel_name": channel_name,
            "subscriber_count": subscriber_count,
            "profile_picture": profile_picture_url,
            "pdf_data": pdf_base64,
            "message": "Analysis completed! Download the PDF below."
        }
        print("✅ Analysis and PDF generation successful.")

        Timer(1.0, restart_server).start()
        return jsonify(response)

    except Exception as e:
        print(f"❌ Analysis and PDF generation failed: {str(e)}")
        Timer(1.0, restart_server).start()
        return jsonify({"error": f"Analysis and PDF generation failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
