export interface DomainEvent { }

type DispatchHandler = (args: DomainEvent) => Promise<void> | void;;

export class DomainEvents {
  private static dispatchers = new Map<string, DispatchHandler>()

  public static register(name: string, dispatcher: DispatchHandler) {
    DomainEvents.dispatchers.set(name, dispatcher)
  }

  public static async dispatch(name: string, args: DomainEvent): Promise<void> {
    const isDispatcher = DomainEvents.dispatchers.has(name)
    if (!isDispatcher) {
      return
    }

    const dispatcher = DomainEvents.dispatchers.get(name)
    await dispatcher!(args)
  }
}
