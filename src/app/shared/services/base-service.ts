import notify from 'devextreme/ui/notify';

export class BaseService {

    constructor(){}

    public handleError(err): void {
        if (err.error instanceof Error) {
            console.error('Client site error: ' + err.error.message);
            this.showError(err.error.message);
        }
        else {
            console.error(`Server site error: ${err}`);
            this.showError(err);
        }
    }

    private showError(message: string = ''): void{
        notify({
            width: 320,
            message: message,
            position: { my: "right top", at: "right top" }
        }, "error", 475);
    }
}