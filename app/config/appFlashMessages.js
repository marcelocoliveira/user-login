var messages = {
		USER_ALREADY_REGISTERED_AND_ACTIVE: "user.email+' is already registered. Please <a href=\"/login\">Login</a>'"
	, USER_ALREADY_REGISTERED_NOT_ACTIVE: "user.email+' is already registered but is not active. <a href=\"/signup/resendActivation\">Resend activation link</a>'"

};

// //REGISTER
// Object.defineProperty(messages,'USER_ALREADY_EXISTS',{value: 'User is already'});
// Object.defineProperty(messages,'UNABLE_TO_FIND_USER_TO_RESEND_MAIL',{value: 'The email address entered is not registered. Please <a href="/signup">Sign Up</a>'});

// //ACCOUNT 
// Object.defineProperty(messages,'INVALID_PASSWORD_USER_DOES_NOT_EXIST',{value:999997});
// Object.defineProperty(messages,'INVALID_PASSWORD_USER_IS_NOT_ACTIVE',{value:999996});
// Object.defineProperty(messages,'INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH',{value:999995});

// Object.defineProperty(messages,'COULD_NOT_FIND_USER_BY_EMAIL',{value:999994});
// Object.defineProperty(messages,'COULD_NOT_FIND_USER_BY_ID',{value:999993});

// //WORKSPACE
// Object.defineProperty(messages,'COULD_NOT_SEARCH_WORKSPACE_BY_OWNER',{value:999992});
// Object.defineProperty(messages,'WORKSPACE_ALREADY_EXISTS',{value:999991});

// //CHANGE PASSWORD
// Object.defineProperty(messages,'CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH',{value:999990});

module.exports = messages; 



