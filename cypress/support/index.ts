
// cypress/support/index.ts

// When the test fails, run this function
Cypress.on('fail', (err, runnable) => {

    // let's store the error message by creating it using our
    //   custom function we just made earlier. We need to pass
    //   "err" and "runnable" that we get from Cypress test fails
    //   but we have to remember to also pass our steps. In case
    //   no steps were provided we have to provide either empty string
    //   or some form of a message to help understand what's going on.
    const customErrorMessage = createCustomErrorMessage(
        err,
        Cypress.env('step') || ['no steps provided...'],
        runnable,
    )

    // Our custom error will now be defaulted back to the
    //   original default Cypress Error
    const customError = err

    // BUT we will change the message we're presenting to our custom one
    customError.message = customErrorMessage

    // aaaand let's throw that error nicely
    throw customError
})

const createCustomErrorMessage = (error: Cypress.CypressError, steps: any[], runnableObj: Mocha.Runnable) => {
    // Let's generate the list of steps from an array of strings
    let lastSteps = "Last logged steps:\n"
    steps.map((step, index) => {
      lastSteps += `${index + 1}. ${step}\n`
    })
  
    // I decided to keep the following as an array
    //   for easier customization. But basically in the end
    //   I'll be building the text from the array by combining those
    //   and adding new line at the end
    const messageArr = [
        `Context: ${runnableObj.parent?.title ?? 'Unknown'}`, // describe('...')
        `Test: ${runnableObj.title}`, // it('...')
        `----------`,
        `${error.message}`, // actual Cypress error message
        `\n${lastSteps}`, // additional empty line to get some space
        //   and the list of steps generated earlier
    ]
  
    // Return the new custom error message
    return messageArr.join('\n')
  }