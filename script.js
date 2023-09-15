// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const counterEl = document.querySelector('.counter');
const textAreaEl = document.querySelector('.form__textarea');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');

const renderFeedbackItem = feedbackItem => {
    // new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedbackItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedbackItem.company}</p>
                <p class="feedback__text">${feedbackItem.text}</p>
            </div>
            <p class="feedback__date">${feedbackItem.daysAgo === 0 ? "NEW" :`${feedbackItem.daysAgo}d`}</p>
        </li>
    `;

    // insert new feedback item in list
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
};


// -- COUNTER COMPONENT -- (IIFE)
// Immediately Invoked Function Expression
// Oldschool modularity
(() => {
    const inputHandler = () => {
        // determine maximum number of characters
        const maxNumChars = MAX_CHARS;
    
        // determine number of characters currently typed
        const numCharsTyped = textAreaEl.value.length;
    
        // calculate number of characters left
        const charsLeft = maxNumChars - numCharsTyped;
    
        // show number of characters left
        counterEl.textContent = charsLeft;
    };
    
    textAreaEl.addEventListener('input', inputHandler);
})();


// -- FORM COMPONENT -- (IIFE)
(() => {
    const showVisualIndicator = textCheck => {
        const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    
        // show valid indicator
        formEl.classList.add(className);
    
        // remove visual indicator
        setTimeout(() => {
            formEl.classList.remove(className);
        }, 2000);
    };
    
    const submitHandler = event => {
        // prevent default browser action
        event.preventDefault();
    
        // get text from textarea
        const text = textAreaEl.value;
        
        // validate text
        if (text.includes('#') && text.length >= 5) {
            showVisualIndicator('valid');
        } else {
            showVisualIndicator('invalid');
    
            // focus textarea
            textAreaEl.focus();
    
            // stop this function execution
            return;
        }
    
        // extract info from text
        const hashtag = text.split('#')[1].split(' ')[0];
    
        const company = hashtag;
        const badgeLetter = company.substring(0, 1).toUpperCase();
        const upvoteCount = 0;
        const daysAgo = 0;
    
        // render feedback item in list
        const feedbackItem = {
            company: company,
            badgeLetter: badgeLetter,
            upvoteCount: upvoteCount,
            daysAgo: daysAgo,
            text: text,
        }
        renderFeedbackItem(feedbackItem);
    
        // send feedback item to server
        fetch(`${BASE_API_URL}/feedbacks`, {
            method: 'POST',
            body: JSON.stringify(feedbackItem),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (!res.ok) {
                console.log('Something went wrong');
                return;
            }
    
            console.log('Successfully submitted');
        }).catch(error => console.log(error));
    
        // clear textarea
        textAreaEl.value = '';
    
        // blur submit button
        submitBtnEl.blur();
    
        // reset counter
        counterEl.textContent = MAX_CHARS;
    };
    
    formEl.addEventListener('submit', submitHandler);
})();


// -- FEEDBACK LIST COMPONENT -- (IIFE)
(() => {
    const clickHandler = event => {
        // get clicked HTML element
        const clickedEl = event.target;
    
        // determine if user intended to upvote or expand
        const upvoteIntention = clickedEl.className.includes('upvote');
    
        // run the appropriate logic
        if (upvoteIntention) {
            // get closest upvote button
            const upvoteBtnEl = clickedEl.closest('.upvote');
    
            // disable upvote button
            upvoteBtnEl.disabled = true;
    
            // select the upvote count element within the upvote button
            const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
    
            // get currently displayed upvote count as a number (+)
            let upvoteCount = +upvoteCountEl.textContent;
    
            // increment and set upvote count 
            upvoteCountEl.textContent = ++upvoteCount;
        } else {
            // expand the clicked feedback item
            clickedEl.closest('.feedback').classList.toggle('feedback--expand');
        }
    
    };
    
    feedbackListEl.addEventListener('click', clickHandler);
    
    fetch(`${BASE_API_URL}/feedbacks`)
        .then(res => {
            return res.json();
        })
        .then(data => {
            // remove spinner
            spinnerEl.remove();
    
            // iterate over each element in feedbacks array and render it in list
            data.feedbacks.forEach(feedbackItem => {
                // render feedback item
                renderFeedbackItem(feedbackItem);
            })
        })
        .catch(error => {
            feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
        });
})();


// -- HASHTAG LIST COMPONENT -- (IIFE)
(() => {
    const clickHandler = event => {
        const clickedEl = event.target;
        
        // stop function if click happens in list but outside buttons
        if (clickedEl.className === 'hashtags') return;
    
        // extract company name
        const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();
    
        // iterate over each feedback item in the list
        feedbackListEl.childNodes.forEach(childNode => {
            if (childNode.nodeType === 3) return;
            
            // extract company name
            const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
            
            // remove feedback item from list if company names are not equal
            if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
                childNode.remove();
            }
        });
    };
    
    hashtagListEl.addEventListener('click', clickHandler);
})();