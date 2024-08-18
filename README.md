# Node.js Express Application

This project is a Node.js application using Express.js that interacts with the Slack API to provide custom functionalities through slash commands. The application requires configuration with Slack and the OpenAI API.

## Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [ngrok](https://ngrok.com/) to expose your local server via HTTPS
- A Slack account with the ability to create a Slack application
- OpenAI API key

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone git@github.com:charlesgourdin/slackDigest.git
   cd your-repo
   ```

2. Install the dependencies:
    ```bash
   npm install
   ```
## Configuration

1. Create a .env file at the root of the project and add your environment variables:
    ```plaintext
    SLACK_TOKEN=your-slack-token
    OPENAI_API_KEY=your-openai-api-key
    ```

2. Set up ngrok to expose your local server:
    ```bash
    ngrok http 3000
    ```

   Copy the forwarding URL (e.g., https://4321-37-168-153-84.ngrok-free.app) for the next step.


3. Go to your Slack app configuration page, add or update the slash command using the forwarding URL with the appropriate route. For example:
    ```plaintext
    https://4321-37-168-153-84.ngrok-free.app/api/resume
    ```

## Running the Application Locally

To start the server in development mode:

```bash
npm run dev
```

## Installing the Slack App

1. On your Slack workspace, install the created application by following Slack's instructions.

2. Ensure the Slack token (SLACK_TOKEN) is correctly configured in your .env file.

## Usage

Once the application is running and installed on your Slack workspace, you can interact with it using the `/resume` command in Slack.

## Notes

- ngrok: Every time you restart ngrok, the forwarding URL changes. You will need to update the URL in your Slack slash command configuration if this happens.
- Ensure that your .env file is properly configured with your required API keys and tokens.