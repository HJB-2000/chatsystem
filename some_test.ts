function testFunction() {
    return new Promise( (resolve) => {
        setTimeout(() => {
            resolve("Test completed");
        }, 2000);
    });
}

async function test() {
    console.log("test function is called");
    const res = await testFunction();
    console.log(res);
}

test(); 