import { AnyAction } from 'redux'; 
import { optional } from 'shell/types';

const oldStateSymbol = Symbol("Old state");
export abstract class BaseReducer<T extends object> {

    protected readonly InitialState: T;

    constructor(initialState: T) {
        this.InitialState = initialState;

        this.Reduce = this.Reduce.bind(this);
        this.ActionSwitch = this.ActionSwitch.bind(this);
    }

    public Reduce(state: optional<T>, action: AnyAction) : T {
        var clone : T | undefined = undefined;
        function createClone(): T {
            if (clone) return clone;
            else return clone = { ...(state as any) };
        }
        (createClone as any)[oldStateSymbol] = state || this.InitialState;

        if (!state)
            clone = { ...(this.InitialState as any)};

        //actual switch
        this.ActionSwitch(createClone, action);

        //freezing and returning state ...
        if (clone) return deepFreeze(clone);
        else return state || this.InitialState;
    }

    protected getOldState(cloner: () => T): T {
        return (cloner as any)[oldStateSymbol] as T;
    }

    abstract ActionSwitch(cloner: () => T, action: AnyAction): void;
}

export function deepFreeze<T>(obj: T): T {
    //help our selfs, by freezing objects after they are "done", so nobody can change it.
    //changing the store without using reducers (that must produce new objects if something change)
    //could cause difficult problems.
    //PS: to improve speed we assume that the sub-properties of a frozen object are also "deep" frozen; so we don't need to check those any more.

    if (!obj) return obj;
    if (Object.isFrozen(obj)) return obj;
    
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).map(prop => deepFreeze((obj as any)[prop]));

    return obj;
}