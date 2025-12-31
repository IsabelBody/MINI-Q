// Interfaces for type safety
export interface QuestionType {
    [key: number]: {
        question: string;
        category: number;
    }
}

export interface CategoryType {
    [key: number]: {
        name: string;
    }
}

export const categoryNames : CategoryType = {
    1 : {"name": "Medicine description"},
    2 : {"name": "Using my medicine"},
    3 : {"name": "Possible side effects"},
    4 : {"name": "Lifestyle impact"},
}

export const questions : QuestionType = {
    1 : {"question": "What my medicine is called", "category": 1},
    2 : {"question": "What my medicine is used for", "category": 1},
    3 : {"question": "What my medicine does", "category": 1},
    4 : {"question": "How my medicine works", "category": 1},
    5 : {"question": "How long it will take to work", "category": 2},
    6 : {"question": "How I will know it is working", "category": 2},
    7 : {"question": "How long I will need to take my medicine", "category": 2},
    8 : {"question": "How to take or use my medicine", "category": 2},
    9 : {"question": "Whether my medicine is available at my local pharmacy and if there will be a cost to me", "category": 2},
    10 : {"question": "Possible side effects of my medicine", "category": 3 },
    11 : {"question": "How likely I am to experience side effects", "category": 3},
    12 : {"question": "What I should do if I experience side effects", "category": 3},
    13 : {"question": "If I can drink alcohol while taking my medicine", "category": 3},
    14 : {"question": "If I can take my medicines with other medicines, natural health products, supplements or food", "category": 4},
    15 : {"question": "Whether my medicine can affect my sex life", "category": 4},
    16 : {"question": "Whether my medicine can make me feel sleepy", "category": 3},
    17 : {"question": "What to do if I miss a dose", "category": 2},
    18 : {"question": "How to get good information about my medicine from the internet", "category": 2},
    19 : {"question": "Changes to my medicine e.g. tablet colour, dose etc.", "category": 1},
    20 : {"question": "What impact taking my medicine will have on my lifestyle", "category": 4}
}

interface Response {
    id: number;
    response: string;
}

interface ResponseData {
    responses: Response[];
}

export function Algorithm(data : ResponseData) {
    const categories: { 
        [key: number]: { 
            totalPoints: number; 
            earnedPoints: number; 
            VIQ: string[]; // VIQ: list of VERY IMPORTANT questions with a response of 2
            IQ: string[]; // IQ: list of IMPORTANT questions with a response of 1
        } 
    } = {};

    let notImportantQuestions : string[] = [] // list of NOT IMPORTANT questions with a response of 0
    let notWantedQuestions : string[] = [] // list of "Do not want" questions with a response of ""

    data.responses.forEach(({ id, response }) => {
        if (id != 0) {
            const category = questions[id as keyof QuestionType].category
            const question = questions[id as keyof QuestionType].question

            if (!categories[category]) {
                categories[category] = { totalPoints: 0, earnedPoints: 0, VIQ: [], IQ: [] };
            }

            if (response == "") {
                notWantedQuestions.push(question);
            } else if (Number(response) == 0){
                notImportantQuestions.push(question);
            } else {
                categories[category].totalPoints += 2;
                categories[category].earnedPoints += Number(response);

                // Add to very important questions if response is 2
                if (Number(response) === 2) {
                    categories[category].VIQ.push(question);
                }

                // Add to important questions if response is 1
                if (Number(response) === 1) {
                    categories[category].IQ.push(question);
                }
            }
        }
    });

    function getOrderedCategoriesForQuestionType(questionType : string) {
        const questionsByCategory: { categoryNumber: number, questions: string[] }[] = [];

        for (const category in categories) {
            const questions = questionType == "VIQ" ? categories[category].VIQ : categories[category].IQ;

            if (questions.length > 0) questionsByCategory.push({ categoryNumber: Number(category), questions });
        }

        return questionsByCategory;
    }

    function getNotImportantQuestions() {
        return notImportantQuestions
    }

    function getNotWantedQuestions() {
        return notWantedQuestions
    }

    function getNumberOfQuestionsForQuestionType(questionType : string) {
        let total = 0

        for (const category in categories) {
            const questions = questionType == "VIQ" ? categories[category].VIQ : categories[category].IQ;
            total += questions.length
        }

        return total
    }

    function getNumberofQuestionsRequested() {
        return getNumberOfQuestionsForQuestionType("VIQ") +getNumberOfQuestionsForQuestionType("IQ")
    }

    return {
        getNotImportantQuestions,
        getNotWantedQuestions,
        getNumberofQuestionsRequested,
        getOrderedCategoriesForQuestionType,
        getNumberOfQuestionsForQuestionType
      }

}