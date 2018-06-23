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
        mapping ( uint => string) options;
        uint numberOfOptions;
    }
    
    struct UserResponse {
        mapping (address => string) userAnswers;
        address[] userAddress;
    }
    
    mapping (uint => Question) public allQuestions;
    mapping (uint => UserResponse) private allUserResponses;
    mapping (uint => Options) allOptions;
    uint public questionCount;

    function askQuestion (string _question) public {
        questionCount++;
        allQuestions[questionCount] = Question(questionCount, _question, msg.sender);
    }

    function questionOptions(uint _questionId, string _option) public {
        allOptions[_questionId].numberOfOptions++;
        allOptions[_questionId].options[allOptions[_questionId].numberOfOptions] = _option;
    }

    function answerQuestion(uint _questionId, string _answer) public {
        allUserResponses[_questionId].userAnswers[msg.sender] = _answer;
        allUserResponses[_questionId].userAddress.push(msg.sender);
    }

    function getQuestionPoll(uint _questionId) public {
        allQuestions[_questionId];
        mapping (string => uint) answerPoll;
        for (uint i = 0; i < allUserResponses[_questionId].userAddress.length; i++) {
            answerPoll[allUserResponses[_questionId].userAnswers[allUserResponses[_questionId].userAddress[i]]]++;
        }
    }

}