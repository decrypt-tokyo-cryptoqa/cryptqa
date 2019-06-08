pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract cryptoQA {
    
    struct Answer {
        bytes32 answerer;
        string[] answer;
    }
    
    mapping(address => mapping(uint256 => mapping(uint256 => Answer))) public Answers;
    mapping(address => mapping(uint256 => uint256[])) public questionToTotalAnswers;
    mapping(address => uint256[]) public totalQuestions;
    
    function answerQuestion(address maker, uint256 questionId, string[] memory result) public returns(bool) {
        require(maker != msg.sender);
        if(!existQuestionId(maker, questionId)) {
            totalQuestions[maker].push(questionId);
        }
        bytes32 answerer_hash = keccak256(abi.encodePacked(msg.sender));
        uint256 answerId = viewNumberOfAnswers(maker, questionId) + 1;
        Answers[maker][questionId][answerId].answerer = answerer_hash;
        Answers[maker][questionId][answerId].answer = result;
        questionToTotalAnswers[maker][questionId].push(1);
        return true;
    }
    
    function viewQuestionToAnswer(address maker, uint256 questionId, uint256 answerId) public view returns (bytes32, string[] memory) {
        bytes32 answerer = Answers[maker][questionId][answerId].answerer;
        string[] memory answer = Answers[maker][questionId][answerId].answer;
        return(answerer, answer);
    }
    
    function viewNumberOfAnswers(address maker, uint256 questionId) public view returns(uint256) {
        return questionToTotalAnswers[maker][questionId].length;
    }
    
    function viewNumberOfQuestions(address maker) public view returns(uint256) {
        return totalQuestions[maker].length;
    }
    
    function existQuestionId(address maker, uint256 questionId) public view returns(bool) {
        for(uint i = 0; i < totalQuestions[maker].length; i++) {
            if(totalQuestions[maker][i] == questionId) {
                return true;
            }
        }
        return false;
    }

}