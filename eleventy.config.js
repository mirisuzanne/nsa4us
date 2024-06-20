import 'dotenv/config';

// External Plugins
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { eleventyImagePlugin } from "@11ty/eleventy-img";
import { exec } from 'child_process';

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      "src/_includes/**/*.webc",
      "src/_includes/**/*.svg",
      "npm:@11ty/eleventy-img/*.webc",
    ],
  });

  	// Image plugin
	eleventyConfig.addPlugin(eleventyImagePlugin, {
		// Set global default options
		formats: ["avif", "jpeg"],
    outputDir: "./_site/img/",

		// Notably `outputDir` is resolved automatically
		// to the project output directory

		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
		},
	});

  eleventyConfig.addPassthroughCopy({
    './src/_favicons/*.*': './',
    './src/_css/*.*': './css/',
    './src/_images/*.*': './img/',
  });

  // config
  eleventyConfig.on('eleventy.beforeWatch', (changedFiles) => {
    const layouts = 'content/_layouts';
    if (!changedFiles.some((filePath) => filePath.includes(`./${layouts}`))) {
      console.log('🤠 Component files updated -- coercing layout reload.')
      exec(`find ${layouts}/*.webc -type f -exec touch {} +`);
    }
  });

  eleventyConfig.setLiquidOptions({jsTruthy: true});
  eleventyConfig.setQuietMode(true);

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};
