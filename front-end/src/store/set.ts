import { AnyAction } from 'redux'; 
import { optional } from 'shell/types';

declare type instanceToKey<T> = (rec:T) => string;
export class setOptions<T> {
    constructor (type: string){
        this.typeName = type;
    }

    typeName: string;
    getKey: undefined | instanceToKey<T>;
}

export interface ISetActions<T> {
    InsertRecord(record: T): AnyAction;
    RemoveRecord(record: T): AnyAction;
    RemoveKey(id: string): AnyAction;
}


export class manager<T> {
    config: setOptions<T>;
    
    constructor (config: setOptions<T>){
        this.config = config;

        if (!this.config.getKey)
            this.config.getKey = (item: T) => (item as any).id;

        this.reducer = this.reducer.bind(this);
        this.actions = this.actions.bind(this);
    }

    public reducer(state:  optional<set<T>>, action: AnyAction ) {
        if (!state) state = new set<T>();

        switch(action.type){
            default: return state;
            case "RECEIVED_RESOURCE_"+this.config.typeName:
                var clone = { ...state };
                clone.items = clone.items || {};

                var rec = new localRecord<T>();
                rec.value = action.record;
                rec.status = 'LOADED';

                clone.items[action.id] = rec;
                return clone;
            case "REQUEST_RESOUCE_"+this.config.typeName:
                var clone = { ...state, items: state.items };
                clone.items = clone.items || {};
                if (clone.items[action.id]) {
                    var item = clone.items[action.id] as localRecord<T>;
                    clone.items[action.id] = { ...item };
                    (clone.items[action.id] as localRecord<T>).status = 'REFRESHING';
                } else {
                    clone.items[action.id] = new localRecord<T>();
                }
                return clone;
            case "DELETE_RESOURCE_"+this.config.typeName:
                var clone = {...state, items: state.items};
                delete (clone.items || {})[action.id];
                return clone;

        }
    }

    public actions(): ISetActions<T>{
        var config = this.config;
        return {
            InsertRecord: function(record: T): AnyAction{
                return { 
                    type: "RECEIVED_RESOURCE_"+config.typeName, 
                    id: config.getKey!(record),
                    record: record,
                };
            },
            RemoveRecord: function(record: T): AnyAction {
                return {
                    type: "DELETE_RESOURCE_"+config.typeName,
                    id: config.getKey!(record),
                };
            },
            RemoveKey: function(id: string): AnyAction {
                return {
                    type: "DELETE_RESOURCE_"+config.typeName,
                    id: id,
                };
            }
        };
    }
}

type hashSetOfT<T> = { [key:string]:T};
export class set<T> {
    constructor(){
        this.items = {};
    }

    items: hashSetOfT<localRecord<T>>;
}

type recState = 'LOADING' | 'LOADED' | 'REFRESHING' | 'DELETING' | 'DELETED';
export class localRecord<T> {
    constructor(){
        this.value = undefined;
        this.status = 'LOADING';
    }

    value: optional<T>;
    status: recState
}