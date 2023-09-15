# Basic Corporate Comment App

## Description
This project is a basic web application developed as a part of a course from [Bytegrad](http://bytegrad.com). The primary goal of this project is to help sharpen fundamental JavaScript skills. The app allows users to submit feedback for corporations.


## Features
- **Character Limit Counter:** A character limit counter shows the number of characters remaining as users type feedback. The maximum character limit is set to 150.

- **Validation:** The app validates user input to ensure that feedback contains at least one hashtag and is a minimum of 5 characters long.

- **Hashtag Filtering:** Users can filter feedback by clicking on hashtags. Clicking a hashtag filters the displayed feedback to show only those related to the selected company.

- **Feedback List:** The app displays a list of user-submitted feedback items, including the company name, feedback text, upvote count, and submission date. Users can upvote feedback and expand feedback items to view more details. (Upvote data does not persist)

- **Fetching Feedback Items:** The app fetches existing feedback items from an api endpoint provided by Bytegrad for the course.

- **Posting Feedback Items:** We can also POST new items to the endpoint provided, however, these entries are scrubbed from the server every hour.


## Installation
To set up this project locally, follow these steps: 

1. Clone the repository: `git clone https://github.com/KadonDEngle/corpcomment-app`
2. Navigate to the project directory: `cd corpcomment-app`
3. Open the `index.html` file in your web browser to run the app.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.