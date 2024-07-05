var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/core/entities/auction.ts
var auctionStatuses = ["OPEN", "CLOSED"];

// src/core/entities/auctions-notification.ts
var AuctionsNotification = class {
  constructor(recipient, subject, body) {
    this.recipient = recipient;
    this.subject = subject;
    this.body = body;
  }
  get() {
    return {
      recipient: this.recipient,
      subject: this.subject,
      body: this.body
    };
  }
};

// src/user/use-cases/index.ts
var use_cases_exports = {};
__export(use_cases_exports, {
  AuctionNotFoundError: () => AuctionNotFoundError,
  AuctionPlaceBidError: () => AuctionPlaceBidError,
  CreateAuctionError: () => CreateAuctionError,
  CreateAuctionUseCase: () => CreateAuctionUseCase,
  GetAuctionUseCase: () => GetAuctionUseCase,
  GetAuctionsByStatusUseCase: () => GetAuctionsByStatusUseCase,
  PlaceBidUseCase: () => PlaceBidUseCase,
  UploadAuctionPictureError: () => UploadAuctionPictureError,
  UploadAuctionPictureUseCase: () => UploadAuctionPictureUseCase
});

// src/user/use-cases/create-auction/create-auction.error.ts
var CreateAuctionError = class _CreateAuctionError extends Error {
  name = "CreateAuctionError";
  constructor(message) {
    super(message);
  }
  static titleValidationFail() {
    return new _CreateAuctionError(`auction's "title" not provided`);
  }
  static sellerValidationFail() {
    return new _CreateAuctionError(`auction's "seller" not provided`);
  }
};

// src/core/result.ts
import { left, right } from "@sweet-monads/either";

// src/core/auctions.error.ts
var AuctionsError = class extends Error {
  name = "AuctionsError";
};

// src/core/base.use-case.ts
var useCaseHandler = async (fn) => {
  try {
    const result = await fn();
    return result.isLeft() ? left(result.value) : right(result.value);
  } catch (error) {
    return left(new AuctionsError(`Unexpected error occur: ${error["message"]}`));
  }
};

// src/user/use-cases/create-auction/create-auction.use-case.ts
var CreateAuctionUseCase = class {
  constructor(createAuctionPort) {
    this.createAuctionPort = createAuctionPort;
  }
  async execute(request) {
    return await useCaseHandler(async () => {
      const createResult = await this.createAuctionPort.create(request);
      if (createResult.isLeft()) {
        return left(createResult.value);
      }
      return right(createResult.value);
    });
  }
};

// src/user/use-cases/get-auction/auction-not-found.error.ts
var AuctionNotFoundError = class extends Error {
  name = "AuctionNotFoundError";
  constructor(id) {
    super(`auction with id: ${id} doesn't exist`);
  }
};

// src/user/use-cases/get-auction/get-auction.use-case.ts
var GetAuctionUseCase = class {
  constructor(getAuctionPort) {
    this.getAuctionPort = getAuctionPort;
  }
  async execute(id) {
    return await useCaseHandler(async () => {
      return await this.getAuctionPort.get(id);
    });
  }
};

// src/user/use-cases/get-auctions-by-status/get-auctions-by-status.use-case.ts
var GetAuctionsByStatusUseCase = class {
  constructor(getByStatusPort) {
    this.getByStatusPort = getByStatusPort;
  }
  async execute(status) {
    return await useCaseHandler(async () => {
      return await this.getByStatusPort.byStatus(status);
    });
  }
};

// src/user/use-cases/place-bid/auction-place-bid.error.ts
var AuctionPlaceBidError = class extends Error {
  name = "AuctionPlaceBidError";
};

// src/user/use-cases/place-bid/place-bid.use-case.ts
var PlaceBidUseCase = class {
  constructor(placeBidPort) {
    this.placeBidPort = placeBidPort;
  }
  async execute(request) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.placeBidPort.get(request.id);
      if (auctionResult.isLeft()) {
        return left(auctionResult.value);
      }
      const placeBidResult = await this.placeBidPort.placeBid(request);
      if (placeBidResult.isLeft()) {
        return left(placeBidResult.value);
      }
      return right(placeBidResult.value);
    });
  }
};

// src/user/use-cases/upload-auction-picture/upload-auction-picture.error.ts
var UploadAuctionPictureError = class extends Error {
  name = "UploadAuctionPictureError";
};

// src/user/use-cases/upload-auction-picture/upload-auction-picture.use-case.ts
var UploadAuctionPictureUseCase = class {
  constructor(auctionPort, uploadPictureService) {
    this.auctionPort = auctionPort;
    this.uploadPictureService = uploadPictureService;
  }
  async execute({ id, seller, pictureBase64 }) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.auctionPort.get(id);
      if (auctionResult.isLeft())
        return left(auctionResult.value);
      if (auctionResult.value.seller !== seller)
        return left(new UploadAuctionPictureError("Only seller allowed to perform this action."));
      const uploadResult = await this.uploadPictureService.upload(id, pictureBase64);
      if (uploadResult.isLeft())
        return left(uploadResult.value);
      const updatedResult = await this.auctionPort.setPictureUrl(id, uploadResult.value);
      if (updatedResult.isLeft())
        return left(updatedResult.value);
      return right(updatedResult.value);
    });
  }
};

// src/automatic/use-cases/index.ts
var use_cases_exports2 = {};
__export(use_cases_exports2, {
  ProcessAuctionsUseCase: () => ProcessAuctionsUseCase
});

// src/automatic/use-cases/process-auctions/process-auctions.use-case.ts
var ProcessAuctionsUseCase = class {
  constructor(port) {
    this.port = port;
  }
  async execute() {
    return await useCaseHandler(async () => {
      const expiredAuctions = await this.port.getExpiredAuctions();
      const closedResult = expiredAuctions.map((a) => this.port.closeAuction(a));
      const closedResultResolved = await Promise.all(closedResult);
      const error = closedResultResolved.find((r) => r.isLeft());
      if (error?.isLeft())
        return left(error.value);
      return right(expiredAuctions.length);
    });
  }
};

// src/notification/use-cases/index.ts
var use_cases_exports3 = {};
__export(use_cases_exports3, {
  SendNotificationUseCase: () => SendNotificationUseCase
});

// src/notification/use-cases/send-notification/send-notification.use.case.ts
var SendNotificationUseCase = class {
  constructor(notificationPort) {
    this.notificationPort = notificationPort;
  }
  async execute(request) {
    return await useCaseHandler(async () => {
      await this.notificationPort.send(request);
      return right(void 0);
    });
  }
};

// src/user/repositories/user-auctions.repository.ts
import { randomUUID } from "crypto";
var UserAuctionsRepository = class {
  constructor(_auction) {
    this._auction = _auction;
  }
  isIdValid(auctionID) {
    const rule = new RegExp(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/);
    return rule.test(auctionID) ? right(true) : left(new AuctionsError('provide a proper auction "id"'));
  }
  async create({ title, seller }) {
    if (!title) {
      return left(CreateAuctionError.titleValidationFail());
    }
    if (!seller) {
      return left(CreateAuctionError.sellerValidationFail());
    }
    const now = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
      id: randomUUID(),
      title,
      seller,
      status: "OPEN",
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
        bidder: ""
      },
      pictureUrl: ""
    };
    await this.persist(auction);
    return right(auction);
  }
  async get(auctionID) {
    const validation = this.isIdValid(auctionID);
    if (validation.isLeft()) {
      return left(validation.value);
    }
    const auction = await this.queryById(auctionID);
    if (this.isIdValid(auction?.id).isLeft()) {
      return left(new AuctionNotFoundError(auctionID));
    }
    this._auction = auction;
    return right(auction);
  }
  async byStatus(status) {
    if (!auctionStatuses.includes(status)) {
      return left(new AuctionsError(`"status" not supported, can't perform get`));
    }
    const auctions = await this.queryByStatus(status);
    return right(auctions);
  }
  async placeBid(request) {
    if (!this._auction) {
      return left(new AuctionNotFoundError(request.id));
    }
    if (this._auction.status === "CLOSED") {
      return left(new AuctionPlaceBidError("Cannot bid on closed auctions"));
    }
    if (request.bidder === this._auction.seller) {
      return left(new AuctionPlaceBidError("Can't bid on your own auctions!"));
    }
    if (request.bidder === this._auction.highestBid.bidder) {
      return left(new AuctionPlaceBidError("You are already the highest bidder!"));
    }
    if (request.amount <= this._auction.highestBid.amount) {
      return left(new AuctionPlaceBidError(`Bid must be higher than: ${this._auction.highestBid.amount}`));
    }
    const auction = await this.persistBid(request);
    return right(auction);
  }
  async setPictureUrl(id, pictureUrl) {
    const auction = await this.persistAuctionPictureUrl(id, pictureUrl);
    if (!auction?.id) {
      return left(new AuctionNotFoundError(id));
    }
    return right(auction);
  }
};

// src/user/repositories/upload-auction-picture.repository.ts
var UploadAuctionPictureRepository = class {
  async upload(id, pictureBase64) {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64string, "base64");
    if (buffer.toString("base64") !== base64string) {
      return left(new UploadAuctionPictureError("Invalid base64 image."));
    }
    const pictureUrl = await this.persistPicture(id, buffer);
    return right(pictureUrl);
  }
};

// src/core/domain.events.ts
var DomainEvents = class _DomainEvents {
  static dispatchers = /* @__PURE__ */ new Map();
  static register(name, dispatcher) {
    if (!name || !dispatcher) {
      return left(new AuctionsError("Could' register an event"));
    }
    _DomainEvents.dispatchers.set(name, dispatcher);
    return right(void 0);
  }
  static async dispatch(name, args) {
    const dispatcher = _DomainEvents.dispatchers.get(name);
    if (!dispatcher) {
      return left(new AuctionsError(`Dispatcher not found for the event: ${name}`));
    }
    await dispatcher(args);
    return right(void 0);
  }
};

// src/automatic/repositories/automatic-process-auctions.repository.ts
var AutomaticProcessAuctionsRepository = class {
  async closeAuction(auction) {
    const { id, title, seller, highestBid } = auction;
    await this.persistClose(id);
    if (!highestBid.amount)
      return await this.doEvent(
        seller,
        "No bids on your auction.",
        `Item "${title}" didn't get any bids.`
      );
    const notifySeller = this.doEvent(
      seller,
      "Item has been sold!",
      `Woohoo! Item "${title}" has been sold for: $${highestBid.amount}`
    );
    const notifyBidder = this.doEvent(
      highestBid.bidder,
      "You won an auction!",
      `You got yourself a "${title}" for $${highestBid.amount}.`
    );
    const resolved = await Promise.all([notifyBidder, notifySeller]);
    const error = resolved.find((r) => r.isLeft());
    if (error?.value)
      return left(error.value);
    return right(void 0);
  }
  async doEvent(recipient, subject, body) {
    const event = new AuctionsNotification(recipient, subject, body);
    return await DomainEvents.dispatch(AuctionsNotification.name, event.get());
  }
};
export {
  AuctionsNotification,
  AutomaticProcessAuctionsRepository,
  use_cases_exports2 as AutomaticUseCases,
  use_cases_exports3 as NotificationUseCases,
  UploadAuctionPictureRepository,
  UserAuctionsRepository,
  use_cases_exports as UserUseCases,
  auctionStatuses
};
