const resultTxtArea = document.querySelector("#result");
const includeTitlesCheckbox = document.querySelector("#include_titles");
const limitWindowCheckbox = document.querySelector("#limit_window");
const copyBtn = document.querySelector("#copyClipboard");
const exportBtn = document.querySelector("#exportBtn");

let os;
chrome.runtime.getPlatformInfo(function (info) {
	os = info.os;
});

const getResult = () => {
	const options = {};
	if (limitWindowCheckbox.checked) {
		options.currentWindow = true;
	}
	chrome.tabs.query(options, (tabs) => {
		resultTxtArea.value = tabs
			.map((t) => {
				if (includeTitlesCheckbox.checked) {
					// Markdown format for easy pasting
					return `[${t.title}](${t.url})`;
				}
				return t.url;
			})
			.join("\n\n");
	});
};

// Seems like a waste to load a whole library for this, better code it up
const getTimeStamp = () => {
	const date = new Date();
	let h = String(date.getHours()).padStart(2, "0");
	let m = String(date.getMinutes()).padStart(2, "0");
	let s = String(date.getSeconds()).padStart(2, "0");
	let tzdiff = date.getTimezoneOffset() / 60;
	let offset = String(tzdiff).padStart(2, "0");
	tzdiff = tzdiff * -1;
	let timestr = h + m + s;
	timestr += tzdiff < 0 ? "-" : "+";
	timestr += offset;
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const YYYY = date.getFullYear();
	return `${YYYY}${mm}${dd}T${timestr}00`;
};

const download = () => {
	let list = resultTxtArea.value;

	if (os === "win") {
		list = list.replace(/\r?\n/g, "\r\n");
	}

	const fileName = getTimeStamp() + "_ExportTabsURLs.txt";

	let element = document.createElement("a");
	element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(list);
	element.download = fileName;
	element.style.display = "none";

	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

// Load on popup show
getResult();

includeTitlesCheckbox.addEventListener("change", getResult);
limitWindowCheckbox.addEventListener("change", getResult);
exportBtn.addEventListener("click", download);
copyBtn.addEventListener("click", (e) => {
	resultTxtArea.select();
	navigator.clipboard.writeText(resultTxtArea.value);
});
