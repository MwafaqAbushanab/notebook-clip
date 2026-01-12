#!/usr/bin/env python3
"""
CLIP Meeting Transcription Script
Transcribes meeting recordings using OpenAI Whisper and saves to knowledge base format
"""

import whisper
import os
import json
from datetime import datetime

# Add imageio-ffmpeg's bundled ffmpeg to PATH
try:
    import imageio_ffmpeg
    ffmpeg_path = os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())
    os.environ["PATH"] = ffmpeg_path + os.pathsep + os.environ.get("PATH", "")
    print(f"Using ffmpeg from: {ffmpeg_path}")
except ImportError:
    print("Warning: imageio-ffmpeg not installed, using system ffmpeg")

# Meeting recordings to transcribe
MEETINGS = [
    {
        "id": "meeting2",
        "file": "2.) CLIP - meeting 3-20251030_140207-Meeting Recording - Copy.mp4",
        "name": "CLIP Meeting 3 (Oct 30, 2025)",
        "description": "Meeting recording covering CLIP process walkthrough and team discussion"
    },
    {
        "id": "meeting3",
        "file": "3. ) Finish CLIP-20251031_131617-Meeting Recording (1) - Copy.mp4",
        "name": "Finish CLIP Session 1 (Oct 31, 2025)",
        "description": "First CLIP completion session - detailed process review and Q&A"
    },
    {
        "id": "meeting4",
        "file": "4.) Finish CLIP-20251031_151052-Meeting Recording - Copy.mp4",
        "name": "Finish CLIP Session 2 (Oct 31, 2025)",
        "description": "Second CLIP completion session - final walkthrough and wrap-up"
    }
]

BASE_DIR = "/home/mabushanab/claude-agents/CLIP"
TRANSCRIPTS_DIR = os.path.join(BASE_DIR, "transcripts")

def transcribe_meeting(meeting, model):
    """Transcribe a single meeting recording"""
    file_path = os.path.join(BASE_DIR, meeting["file"])

    if not os.path.exists(file_path):
        print(f"  ERROR: File not found: {file_path}")
        return None

    print(f"  Transcribing {meeting['name']}...")
    print(f"  File: {meeting['file']}")
    print(f"  This may take several minutes...")

    try:
        # Use fp16=False on CPU to avoid issues
        result = model.transcribe(file_path, language="en", verbose=False, fp16=False)
        return result
    except Exception as e:
        print(f"  ERROR: Failed to transcribe: {e}")
        return None

def save_transcript(meeting, result):
    """Save transcript to file"""
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

    # Save raw transcript
    transcript_file = os.path.join(TRANSCRIPTS_DIR, f"{meeting['id']}_transcript.txt")
    with open(transcript_file, "w") as f:
        f.write(f"# {meeting['name']}\n")
        f.write(f"# {meeting['description']}\n")
        f.write(f"# Source: {meeting['file']}\n")
        f.write(f"# Transcribed: {datetime.now().isoformat()}\n\n")
        f.write(result["text"])

    # Save segments with timestamps
    segments_file = os.path.join(TRANSCRIPTS_DIR, f"{meeting['id']}_segments.json")
    with open(segments_file, "w") as f:
        json.dump({
            "meeting": meeting,
            "segments": result.get("segments", []),
            "language": result.get("language", "en"),
            "transcribed_at": datetime.now().isoformat()
        }, f, indent=2)

    print(f"  Saved: {transcript_file}")
    print(f"  Saved: {segments_file}")

    return transcript_file

def generate_knowledge_chunks(meeting, result):
    """Generate knowledge base chunks from transcript"""
    chunks = []
    text = result["text"]

    # Split into roughly 500-word chunks for knowledge base
    words = text.split()
    chunk_size = 500

    for i in range(0, len(words), chunk_size):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words)

        chunk_id = f"{meeting['id']}-chunk-{i // chunk_size + 1}"
        chunks.append({
            "id": chunk_id,
            "title": f"{meeting['name']} - Part {i // chunk_size + 1}",
            "category": "Meeting Transcripts",
            "source": meeting['name'],
            "content": chunk_text
        })

    return chunks

def main():
    print("=" * 60)
    print("CLIP Meeting Transcription")
    print("=" * 60)
    print()

    # Load Whisper model - using 'tiny' for low memory systems
    print("Loading Whisper model (tiny - optimized for low memory)...")
    print("Note: First run downloads the model (~75MB)")
    model = whisper.load_model("tiny")
    print("Model loaded!\n")

    all_chunks = []

    for i, meeting in enumerate(MEETINGS, 1):
        print(f"\n[{i}/{len(MEETINGS)}] Processing: {meeting['name']}")
        print("-" * 50)

        result = transcribe_meeting(meeting, model)

        if result:
            save_transcript(meeting, result)
            chunks = generate_knowledge_chunks(meeting, result)
            all_chunks.extend(chunks)

            word_count = len(result["text"].split())
            print(f"  Word count: {word_count}")
            print(f"  Generated {len(chunks)} knowledge chunks")
        else:
            print(f"  Skipping {meeting['name']}")

    # Save all chunks for knowledge base import
    if all_chunks:
        chunks_file = os.path.join(TRANSCRIPTS_DIR, "meeting_knowledge_chunks.json")
        with open(chunks_file, "w") as f:
            json.dump(all_chunks, f, indent=2)
        print(f"\n\nSaved {len(all_chunks)} total chunks to: {chunks_file}")

    # Generate JavaScript export for clipDocuments.js
    if all_chunks:
        js_file = os.path.join(TRANSCRIPTS_DIR, "meeting_chunks_export.js")
        with open(js_file, "w") as f:
            f.write("// Meeting Transcript Chunks - Add these to clipDocuments.js\n")
            f.write("// Generated: " + datetime.now().isoformat() + "\n\n")
            f.write("export const meetingTranscriptChunks = ")
            f.write(json.dumps(all_chunks, indent=2))
            f.write(";\n")
        print(f"Saved JS export to: {js_file}")

    print("\n" + "=" * 60)
    print("Transcription complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
