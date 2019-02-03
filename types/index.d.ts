import { Chalk } from 'chalk';

export interface SelectorOptions {
    cursor?: string;
    checked?: string;
    unchecked?: string;
    cursorColor?: string;
    bracketColor?: string;
    markColor?: string;
    textColor?: string;
    multiselect?: boolean;
    highlight?: boolean;
}

export interface SelectorConstructor {
	new (options?: SelectorOptions): Selector;
	(options?: SelectorOptions): Selector;
}

export class Selector {
    constructor(config?: SelectorOptions);
    add(text: string, value?: any): this;
    render(): Promise<Array<any>>;
}

export default Selector;