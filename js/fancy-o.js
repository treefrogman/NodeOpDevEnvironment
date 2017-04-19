(function fancyNorwegianØ() {
	var asciiHost = "node.mkc7.com",
		punycodeHost = "xn--nde-0na.mkc7.com",
		hostIsPunycode = location.hostname === punycodeHost,
		øLangs = ["no", "nb", "nn", "da", "fo"],
		øLangEnabled = false,
		l = øLangs.length,
		i = 0;
	for (; i < l; i++) {
		if (clientInformation.languages.indexOf(øLangs[i]) > -1) {
			øLangEnabled = true;
			break;
		}
	}
	if (øLangEnabled && !hostIsPunycode) {
		location.hostname = punycodeHost;
	} else if (!øLangEnabled && hostIsPunycode) {
		location.hostname = asciiHost;
	}
}());