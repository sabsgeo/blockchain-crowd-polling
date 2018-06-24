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
        mapping (uint => string) optionsReverse;        
        mapping (uint => uint) optionPoll;
        uint numberOfOptions;
    }
    
    struct UserResponse {
        mapping (address => uint) userAnswers;
    }
    
    mapping (uint => Question) public allQuestions;
    mapping (uint => UserResponse) private allUserResponses;
    mapping (uint => Options) allOptions;
    uint public questionCount;
    event QuestionPollResult(string _question, uint _userAnswer);

    function askQuestion (string _question) public {
        questionCount++;
        allQuestions[questionCount] = Question(questionCount, _question, msg.sender);
    }

    function questionOptions(uint _questionId, string _option) public {
        allOptions[_questionId].numberOfOptions++;
        allOptions[_questionId].options[_option] = allOptions[_questionId].numberOfOptions;
        allOptions[_questionId].optionsReverse[allOptions[_questionId].numberOfOptions] = _option;
    }

    function answerQuestion(uint _questionId, string _answer) public {
        // allOptions[_questionId].options[_answer]
        allOptions[_questionId].optionPoll[allOptions[_questionId].options[_answer]]++;
        allUserResponses[_questionId].userAnswers[msg.sender] = allOptions[_questionId].options[_answer];
        // [_questionId].userAddress.push(msg.sender);
    }

    function getQuestionPoll(uint _questionId) public returns (string, uint, bytes32[10], uint[]) {
        uint[] questionPoll;
        bytes32[10] bytesArray;

        for (uint optionsIndex = 1; optionsIndex <= allOptions[_questionId].numberOfOptions; optionsIndex++) {
            // questionOptions.push(allOptions[_questionId].optionsReverse[optionsIndex]);
            //bytesArray[optionsIndex] = "allOptions[_questionId].optionsReverse[optionsIndex]"; 
            bytesArray[optionsIndex] = "ABCDEFGHdlhkukkkkkkkIJKubjkffghh";
            questionPoll.push(allOptions[_questionId].optionPoll[optionsIndex]);
        }
        return (allQuestions[_questionId].question,
        allUserResponses[_questionId].userAnswers[msg.sender],
        bytesArray,
        questionPoll);
    }

}