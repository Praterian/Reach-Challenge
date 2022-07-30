'reach 0.1';

const COUNTDOWN = 20;

const Shared = {
    showTime: Fun([UInt], Null),
}

export const main = Reach.App(() => {
    const A = Participant('Alice', {
        ...Shared,
        inherit: UInt,
        getChoice: Fun([], Bool),
    });
    const B = Participant('Bob', {
        ...Shared,
        acceptTerms: Fun([UInt], Bool),
    });
    init();

    A.only(() => {
        const value = declassify(interact.inherit);
    })
    A.publish(value)
        .pay(value);
    commit();

    B.only(() => {
        const terms = declassify(interact.acceptTerms(value));
    })
    B.publish(terms);
    commit();

    each([A, B], () => {
        interact.showTime(COUNTDOWN);
    });

    A.only(() => {
        const stillHere = declassify(interact.getChoice())
    })
    A.publish(stillHere)
    if (stillHere == true) {
        transfer(value).to(A);
    } else {
        transfer(value).to(B);
    }



    commit()
    exit();
});

// Praterian#4444