
/**
 * Universal waitFor function. Repeats given function until it return truthly value.
 * Accepts synchronous and asynchronous functions as argument.  
 * 
 * @param func Function that should return truthly value to pass waitFor
 * @param timeoutMs Timeout for throw waitFor Error
 * @param runEveryMs Period for repeat test function
 */
export async function waitFor<T>(func: () => T, timeoutMs: number = 10000, runEveryMs: number = 250): Promise<T> {
    const endTime = Date.now() + timeoutMs;
    let result: T, nextTickTime: number;

    while (Date.now() < endTime) {
        nextTickTime = Date.now() + runEveryMs

        try {
            result = await func();
            if (result) return result;
        } catch(e) {}
        
        await sleep(nextTickTime - Date.now());
    }

    throw new Error(`Wait failed after timeout [${timeoutMs}ms]. 
    \nFunction body: \n${func.toString()}`);
}

export async function tryWaitFor<T>(func: () => T | Promise<T>, timeoutMs: number = 10000, runEveryMs: number = 250): Promise<T> {
    const endTime = Date.now() + timeoutMs;
    let result: T, nextTickTime: number;

    while (Date.now() < endTime) {
        nextTickTime = Date.now() + runEveryMs

        try {
            result = await func();
            if (result) return result;
        } catch(e) {}
        
        await sleep(nextTickTime - Date.now());
    }

    return null;
}

export function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}