const inquirer = require("inquirer");
const fs = require("fs");
const generateMarkdown = require("./generateMarkdown");

// Array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the project title?'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Describe your project',
    },
    {
        type: 'input',
        name: 'installation',
        message: 'What are the installation instructions for the project?',

    },
    {
        type: 'input',
        name: 'usage',
        message: 'What is the project usage information?',

    },
    {
        type: 'input',
        name: 'contributionGuidelines',
        message: 'If contributors are allowed, please provide guidelines! If not, press Enter and leave on blank'
    },
    {
        type: 'input',
        name: 'test',
        message: 'What are the project test instructions? '
    },
    {
        type: 'list',
        name: 'license',
        message: 'What license are you using?',
        choices: ["Apache-2.0", "Boost-1.0", "GNU GLP-v3.0", "MIT", "No License"],

    },
    {
        type: 'input',
        name: 'year',
        message: 'Copyright year?',
    },
    {
        type: 'input',
        name: 'holder',
        message: 'Name of author?'
    },
    {
        type: 'input',
        name: 'contact1',
        message: 'What is your Github username?',

    },
    {
        type: 'input',
        name: 'contact2',
        message: 'For further questions, what is your e-mail address?',
    }
];

// README file creator function
function writeToFile() {
    inquirer.prompt(questions).then(data => {
        try {
            fs.writeFileSync("./dist/README.md", generateMarkdown(data));
            console.log('README.md sucessfully created!')
        } catch (err) {
            console.log(err);

        }

    })
}

// Function to initialize app
function init() {
    writeToFile()
}


// Function call to initialize app
init();
