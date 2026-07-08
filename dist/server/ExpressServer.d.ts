export declare class ExressServer {
    readonly app: import("express-serve-static-core").Express;
    constructor();
    private configure;
    start(PORT: number): void;
}
