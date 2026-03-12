const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Only allow POST requests from your Surgical Editor
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { filePath, content, sha } = JSON.parse(event.body);
    
    // Initialize the GitHub connection using your Netlify Environment Variable
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Perform the "Surgical Mutation" on the GitHub file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: "ethanscottslatermm-cpu", // Your GitHub username
      repo: "json-studio-pro",         // Your project name
      path: filePath,
      message: "AI-Surgical Repair: Fixed JSON syntax error",
      content: Buffer.from(content).toString("base64"), // GitHub requires base64 encoding
      sha: sha, // The unique ID of the version you are replacing
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File successfully repaired on GitHub!", data: response.data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to write to GitHub: " + error.message })
    };
  }
};
