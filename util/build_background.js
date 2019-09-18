require('dotenv').config();
var fs = require('fs');
fs.readFile('./util/background.unrendered.js', (err, data) => {
	if (err) {
		console.error(err);
	} else {
		data = data
			.toString()
			.replace('env.HOST', process.env.HOST)
			.replace('env.PORT', process.env.PORT);

		fs.writeFile('./src/background.js', data, (err) => {
			if (err) {
				console.error(err);
			} else {
				console.log(
					'Successfully built background.js into the sr directory.',
				);
			}
		});
	}
});
