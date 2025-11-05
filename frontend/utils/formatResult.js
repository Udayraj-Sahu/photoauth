/**
 * Formats the backend response into clean UI-friendly data.
 * @param {Object} data - The backend JSON from /analyze
 * @returns {Object} formatted result
 */
export const formatResult = (data) => {
	if (!data) return null;

	const score = Math.round((data.authenticity_score || 0) * 100) || 0;
	const label = data.final_label || "Unknown";

	let color = "#999";
	let statusIcon = "⚪";
	let description = "";

	if (label === "Authentic") {
		color = "#48BB78";
		statusIcon = "✅";
		description = "This image appears authentic with minimal manipulation.";
	} else if (label === "Possibly Edited") {
		color = "#F6E05E";
		statusIcon = "⚠️";
		description =
			"Some inconsistencies detected. Image may have been edited.";
	} else if (label === "AI/Edited") {
		color = "#F56565";
		statusIcon = "❌";
		description =
			"High probability of AI generation or photo manipulation.";
	}

	const model = data.model || {};
	const metadata = data.metadata || {};
	const ela = data.ela || {};

	// ✅ FIXED: read nested models if available
	const models = model.models || data.models_detail || {};
	const vitConf = models.vit_conf ?? 0;
	const clipConf = models.clip_conf ?? 0;

	return {
		label,
		score,
		color,
		statusIcon,
		description,
		confidence: model.confidence || 0,
		modelLabel: model.label || "N/A",
		elaScore: ela.ela_score || 0,
		software: metadata.software || "Unknown",
		exifPresent: metadata.exif_present || false,
		possibleEdit: metadata.possible_edit || false,
		// ✅ Per-model breakdown
		vitConf,
		clipConf,
	};
};

export const summarizeResult = (formatted) => {
	if (!formatted) return "";
	return `${formatted.statusIcon} ${formatted.label} (${formatted.score}%) — ${formatted.description}`;
};
