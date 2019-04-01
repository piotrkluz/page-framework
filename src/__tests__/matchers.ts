
export async function shouldThrow(func: () => any) {
    let error;
    try {
        await func();
    } catch (e) {
        error = e;
    }
    expect(error).toBeTruthy();
}