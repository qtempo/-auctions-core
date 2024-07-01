"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuctionRepository: () => AuctionRepository,
  UserModule: () => user_exports,
  auctionStatuses: () => auctionStatuses
});
module.exports = __toCommonJS(src_exports);

// src/core/domain/auction.ts
var auctionStatuses = ["OPEN", "CLOSED"];

// src/modules/user/index.ts
var user_exports = {};
__export(user_exports, {
  AuctionNotFoundError: () => AuctionNotFoundError,
  AuctionPlaceBidError: () => AuctionPlaceBidError,
  CreateAuctionError: () => CreateAuctionError,
  CreateAuctionUseCase: () => CreateAuctionUseCase,
  GetAuctionUseCase: () => GetAuctionUseCase,
  GetAuctionsByStatusUseCase: () => GetAuctionsByStatusUseCase,
  MockUploadAuctionPictureRepository: () => MockUploadAuctionPictureRepository,
  PlaceBidUseCase: () => PlaceBidUseCase,
  UploadAuctionPictureError: () => UploadAuctionPictureError,
  UploadAuctionPictureRepository: () => UploadAuctionPictureRepository,
  UploadAuctionPictureUseCase: () => UploadAuctionPictureUseCase
});

// src/core/result.ts
var import_either = require("@sweet-monads/either");

// src/modules/user/repositories/upload-auction-picture.repository.ts
var UploadAuctionPictureRepository = class {
  async upload(id, pictureBase64) {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64string, "base64");
    if (buffer.toString("base64") !== base64string) {
      return (0, import_either.left)(new UploadAuctionPictureError("Invalid base64 image."));
    }
    const pictureUrl = await this.persistPicture(id, buffer);
    return (0, import_either.right)(pictureUrl);
  }
};

// src/modules/user/repositories/mock-upload-auction-picture.repository.ts
var MockUploadAuctionPictureRepository = class extends UploadAuctionPictureRepository {
  persistPicture(id, pictureBuffer) {
    return Promise.resolve(`${id}_${pictureBuffer}`);
  }
};

// src/modules/user/use-cases/create-auction/create-auction.error.ts
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

// src/core/auctions.error.ts
var AuctionsError = class extends Error {
  name = "AuctionsError";
};

// src/core/base.use-case.ts
var useCaseHandler = async (fn) => {
  try {
    const result = await fn();
    return result.isLeft() ? (0, import_either.left)(result.value) : (0, import_either.right)(result.value);
  } catch (error) {
    return (0, import_either.left)(new AuctionsError(`Unexpected error occur: ${error["message"]}`));
  }
};

// src/modules/user/use-cases/create-auction/create-auction.use-case.ts
var CreateAuctionUseCase = class {
  constructor(createAuctionPort) {
    this.createAuctionPort = createAuctionPort;
  }
  async execute(request) {
    return await useCaseHandler(async () => {
      const createResult = await this.createAuctionPort.create(request);
      if (createResult.isLeft()) {
        return (0, import_either.left)(createResult.value);
      }
      return (0, import_either.right)(createResult.value);
    });
  }
};

// src/modules/user/use-cases/get-auction/auction-not-found.error.ts
var AuctionNotFoundError = class extends Error {
  name = "AuctionNotFoundError";
  constructor(id) {
    super(`auction with id: ${id} doesn't exist`);
  }
};

// src/modules/user/use-cases/get-auction/get-auction.use-case.ts
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

// src/modules/user/use-cases/get-auctions-by-status/get-auctions-by-status.use-case.ts
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

// src/modules/user/use-cases/place-bid/auction-place-bid.error.ts
var AuctionPlaceBidError = class extends Error {
  name = "AuctionPlaceBidError";
};

// src/modules/user/use-cases/place-bid/place-bid.use-case.ts
var PlaceBidUseCase = class {
  constructor(placeBidPort) {
    this.placeBidPort = placeBidPort;
  }
  async execute(request) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.placeBidPort.get(request.id);
      if (auctionResult.isLeft()) {
        return (0, import_either.left)(auctionResult.value);
      }
      const placeBidResult = await this.placeBidPort.placeBid(request);
      if (placeBidResult.isLeft()) {
        return (0, import_either.left)(placeBidResult.value);
      }
      return (0, import_either.right)(placeBidResult.value);
    });
  }
};

// src/modules/user/use-cases/upload-auction-picture/upload-auction-picture.error.ts
var UploadAuctionPictureError = class extends Error {
  name = "UploadAuctionPictureError";
};

// src/modules/user/use-cases/upload-auction-picture/upload-auction-picture.use-case.ts
var UploadAuctionPictureUseCase = class {
  constructor(auctionPort, uploadPictureService) {
    this.auctionPort = auctionPort;
    this.uploadPictureService = uploadPictureService;
  }
  async execute({ id, seller, pictureBase64 }) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.auctionPort.get(id);
      if (auctionResult.isLeft())
        return (0, import_either.left)(auctionResult.value);
      if (auctionResult.value.seller !== seller)
        return (0, import_either.left)(new UploadAuctionPictureError("Only seller allowed to perform this action."));
      const uploadResult = await this.uploadPictureService.upload(id, pictureBase64);
      if (uploadResult.isLeft())
        return (0, import_either.left)(uploadResult.value);
      const updatedResult = await this.auctionPort.setPictureUrl(id, uploadResult.value);
      if (updatedResult.isLeft())
        return (0, import_either.left)(updatedResult.value);
      return (0, import_either.right)(updatedResult.value);
    });
  }
};

// src/core/repositories/auction.repository.ts
var import_crypto = require("crypto");
var AuctionRepository = class {
  constructor(_auction) {
    this._auction = _auction;
  }
  isIdValid(auctionID) {
    const rule = new RegExp(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/);
    return rule.test(auctionID) ? (0, import_either.right)(true) : (0, import_either.left)(new AuctionsError('provide a proper auction "id"'));
  }
  async create({ title, seller }) {
    if (!title) {
      return (0, import_either.left)(CreateAuctionError.titleValidationFail());
    }
    if (!seller) {
      return (0, import_either.left)(CreateAuctionError.sellerValidationFail());
    }
    const now = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
      id: (0, import_crypto.randomUUID)(),
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
    return (0, import_either.right)(auction);
  }
  async get(auctionID) {
    const validation = this.isIdValid(auctionID);
    if (validation.isLeft()) {
      return (0, import_either.left)(validation.value);
    }
    const auction = await this.queryById(auctionID);
    if (this.isIdValid(auction?.id).isLeft()) {
      return (0, import_either.left)(new AuctionNotFoundError(auctionID));
    }
    this._auction = auction;
    return (0, import_either.right)(auction);
  }
  async byStatus(status) {
    if (!auctionStatuses.includes(status)) {
      return (0, import_either.left)(new AuctionsError(`"status" not supported, can't perform get`));
    }
    const auctions = await this.queryByStatus(status);
    return (0, import_either.right)(auctions);
  }
  async placeBid(request) {
    if (!this._auction) {
      return (0, import_either.left)(new AuctionNotFoundError(request.id));
    }
    if (this._auction.status === "CLOSED") {
      return (0, import_either.left)(new AuctionPlaceBidError("Cannot bid on closed auctions"));
    }
    if (request.bidder === this._auction.seller) {
      return (0, import_either.left)(new AuctionPlaceBidError("Can't bid on your own auctions!"));
    }
    if (request.bidder === this._auction.highestBid.bidder) {
      return (0, import_either.left)(new AuctionPlaceBidError("You are already the highest bidder!"));
    }
    if (request.amount <= this._auction.highestBid.amount) {
      return (0, import_either.left)(new AuctionPlaceBidError(`Bid must be higher than: ${this._auction.highestBid.amount}`));
    }
    const auction = await this.persistBid(request);
    return (0, import_either.right)(auction);
  }
  async setPictureUrl(id, pictureUrl) {
    const auction = await this.persistAuctionPictureUrl(id, pictureUrl);
    if (!auction?.id) {
      return (0, import_either.left)(new AuctionNotFoundError(id));
    }
    return (0, import_either.right)(auction);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuctionRepository,
  UserModule,
  auctionStatuses
});
