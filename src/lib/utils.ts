
export async function waitFor<T>(func: () => T, timeout: number = 10000, runEveryMs: number = 250): Promise<T> {
    const endTime = Date.now() + timeout;
    let result: T, nextTickTime: number;

    while (Date.now() < endTime) {
        nextTickTime = Date.now() + runEveryMs

        try {
            result = await func();
            if (result) return result;
        } catch(e) {}
        
        await sleep(nextTickTime - Date.now());
    }

    throw new Error(`Wait failed after timeout [${timeout}ms]. 
    \nFunction body: \n${func.toString()}`);
}

export function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}