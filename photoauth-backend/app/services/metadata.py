import exifread
from io import BytesIO

def extract_metadata(image_bytes):
    """Extract EXIF data safely without crashing."""
    try:
        tags = exifread.process_file(BytesIO(image_bytes), details=False)
        if not tags:
            return {"exif_present": False, "possible_edit": False, "software": None}

        # Detect possible edit based on software field
        software = str(tags.get("Image Software", "")).lower()
        possible_edit = any(word in software for word in ["photoshop", "gimp", "pixlr", "remini", "snapseed"])
        return {
            "exif_present": True,
            "possible_edit": possible_edit,
            "software": software or "Unknown"
        }

    except Exception:
        # No EXIF or corrupted header
        return {"exif_present": False, "possible_edit": False, "software": None}
