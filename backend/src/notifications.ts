export class Notification {
	private message: string;

	constructor(message: string) {
		this.message = message;
	}

	send(): string {
		return this.message
	}

}

export class EmailNotification extends Notification {
	private receipient: string;

	constructor(message: string, receipient: string) {
		super(message)
		this.receipient = receipient
	}

	send(): string {
		return `Sending ${super.send()} to ${this.receipient}`
	}
}