pragma solidity ^0.4.17;


contract QuestionsAndAnswers {
    
    // This is the structure of the question
    struct Question {
        uint id;
        string question;
        address postedUser;
    }

    // This is the structure of the options of each question
    struct Options {
        mapping (string => uint) options;
        mapping (uint => uint) optionPoll;
        uint numberOfOptions;
    }
    
    struct UserResponse {
        mapping (address => uint) userAnswers;
    }
    
    mapping (uint => Question) public allQuestions;
    mapping (uint => UserResponse) allUserResponses;
    mapping (uint => Options) public allOptions;
    uint public questionCount;
    event QuestionPollResult(string _question, uint _userAnswer);

    function askQuestion (string _question) public {
        questionCount++;
        allQuestions[questionCount] = Question(questionCount, _question, msg.sender);
    }

    function questionOptions(uint _questionId, string _option) public {
        allOptions[_questionId].numberOfOptions++;
        allOptions[_questionId].options[_option] = allOptions[_questionId].numberOfOptions;
    }

    function answerQuestion(uint _questionId, string _answer) public {
        allOptions[_questionId].optionPoll[allOptions[_questionId].options[_answer]]++;
        allUserResponses[_questionId].userAnswers[msg.sender] = allOptions[_questionId].options[_answer];
    }

}