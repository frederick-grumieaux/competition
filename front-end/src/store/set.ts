import { AnyAction } from 'redux'; 
import { optional } from 'shell/types';
import { BaseReducer } from 'store/reducer';

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


export class Manager<T>  extends BaseReducer<set<T>> {
    protected config: setOptions<T>;
    
    constructor(config: setOptions<T>) {
        super(new set<T>());

        this.config = config;

        if (!this.config.getKey)
            this.config.getKey = (item: T) => (item as any).id;

        this.actions = this.actions.bind(this);
    }

    ActionSwitch(cloner: () => set<T>, action: AnyAction) {
        switch(action.type) { 
            case 'RECEIVED_RESOURCE_'+ this.config.typeName: return this.receivedRecord(cloner, action);
            case 'DELETE_RESOURCE_' + this.config.typeName: return this.deleteRecord(cloner, action);
            case 'REQUEST_RESOUCE_' + this.config.typeName: return this.requestRecord(cloner, action);
        }
    }

    cloneItems(cloner: () => set<T>): set<T> {
        var clone = cloner();
        clone.items = { ...clone.items };
        return clone;
    }

    requestRecord(cloner: () => set<T>, action: AnyAction) {
        var clone = this.cloneItems(cloner);        
        if (clone.items[action.id]) {
            var item = clone.items[action.id] as localRecord<T>;
            clone.items[action.id] = { ...item };
            (clone.items[action.id] as localRecord<T>).status = 'REFRESHING';
        } else {
            clone.items[action.id] = new localRecord<T>();
        }
        return clone;
    }
    receivedRecord(cloner: () => set<T>, action: AnyAction) {
        var clone = this.cloneItems(cloner);
        
        var rec = new localRecord<T>();
        rec.value = action.record;
        rec.status = 'LOADED';

        clone.items[action.id] = rec;
        return clone;
    }
    deleteRecord(cloner: () => set<T>, action: AnyAction) {
        //check if the record was in memory
        var oldstate = super.getOldState(cloner);
        if (!oldstate.items[action.id]) return;

        //do the stuff..
        var clone = this.cloneItems(cloner);
        delete clone.items[action.id];
        return clone;
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