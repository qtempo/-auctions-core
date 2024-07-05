import { AuctionsError } from './auctions.error'
import { Result, left, right } from './result'

type Args = { [name: string]: string }
type DispatchHandler = (args: Args) => Promise<void> | void;; // todo: wft? o_O

export class DomainEvents {
  private static dispatchers = new Map<string, DispatchHandler>()

  public static register(name: string, dispatcher: DispatchHandler): Result<AuctionsError, void> {
    if (!name || !dispatcher) {
      return left(new AuctionsError('Could\' register an event'))
    }
    DomainEvents.dispatchers.set(name, dispatcher)
    return right(void 0)
  }

  public static async dispatch(name: string, args: Args): Promise<Result<AuctionsError, void>> {
    const dispatcher = DomainEvents.dispatchers.get(name)
    if (!dispatcher) {
      return left(new AuctionsError(`Dispatcher not found for the event: ${name}`))
    }
    await dispatcher(args)
    return right(void 0)
  }
}
