const prisma = require("../config/db")
const httpError = require("../middlewares/httpError")

// const registerShop = async (req, res, next) => {
//     const {
//         accountId,
//         name,
//         slug,
//         description,
//         merchantTemplateId,
//         mode ,
//         domain
//     } = req.body;
// console.log(domain)
//     if (!mode || !["create", "update"].includes(mode)) {
//         return next(new httpError("Invalid mode. Mode must be either 'create' or 'update'.", 400));
//     }

//     try {
//         const merchant = await prisma.merchant.findFirst({
//             where: { accountId }
//         });

//         if (!merchant) {
//             return next(new httpError('Please register as a merchant first.', 409));
//         }

//         if (mode === "create") {
//             if (!req.file) return next(new httpError("Logo is required for shop creation.", 400));

//             const existingShop = await prisma.shop.findFirst({
//                 where: { name }
//             });

//             if (existingShop) {
//                 return next(new httpError('Shop name is already taken. Try another one.', 409));
//             }

//             const newShop = await prisma.shop.create({
//                 data: {
//                     name: merchant.businessName,
//                     slug,
//                     description,
//                     merchantId: merchant.id,
//                     logoImageUrl: req.file.filename,
//                     locationId: merchant.locationId,
//                     merchantTemplateId,
//                     domain
//                 }
//             });

//             return res.status(201).json({
//                 message: 'Shop registered successfully.',
//                 status: "success",
//                 shop: newShop
//             });

//         } else if (mode === "update") {
//             const existingShop = await prisma.shop.findFirst({
//                 where: { merchantId: merchant.id }
//             });

//             if (!existingShop) {
//                 return next(new httpError("Shop not found. You need to register it first.", 404));
//             }

//             const updatedShop = await prisma.shop.update({
//                 where: { id: existingShop.id },
//                 data: {
//                     name: name || existingShop.name,
//                     slug: slug || existingShop.slug,
//                     domain: domain ,
//                     description: description || existingShop.description,
//                     merchantTemplateId: merchantTemplateId || existingShop.merchantTemplateId,
//                     logoImageUrl: req.file ? req.file.filename : existingShop.logoImageUrl
//                 }
//             });

//             return res.status(200).json({
//                 message: 'Shop updated successfully.',
//                 status: "success",
//                 shop: updatedShop
//             });
//         }

//     } catch (error) {
//         console.error('Register/Update Shop Error:', error);
//         return next(new httpError("Server error. Please try again later.", 500));
//     }
// };
const fs = require('fs').promises;
const path = require('path');
const ShopSetup = require("../utils/setupShopFolder");

const registerShop = async (req, res, next) => {
    const {
        accountId,
        name,
        slug,
        description,
        merchantTemplateId,
        mode,
        domain
    } = req.body;
    if (!mode || !["create", "update"].includes(mode)) {
        return next(new httpError("Invalid mode. Mode must be either 'create' or 'update'.", 400));
    }
    console.log(domain, 'domain')
    try {
        const merchant = await prisma.merchant.findFirst({
            where: { accountId }
        });

        if (!merchant) {
            return next(new httpError('Please register as a merchant first.', 409));
        }

        if (mode === "create") {
            if (!req.file) return next(new httpError("Logo is required for shop creation.", 400));

            const existingShop = await prisma.shop.findFirst({
                where: {
                    domain: domain
                }
            });
            if (existingShop) {
                return next(new httpError('Shop domain is already taken. Try another one.', 409));
            }

            // Start transaction
            const newShop = await prisma.$transaction(async (prisma) => {
                // Create shop in database
                const shop = await prisma.shop.create({
                    data: {
                        name: merchant.businessName,
                        slug,
                        description,
                        merchantId: merchant.id,
                        logoImageUrl: req.file.filename,
                        locationId: merchant.locationId,
                        merchantTemplateId,
                        domain,
                    }
                });

                try {
                    // Setup shop folder structure
                    const shopSetup = new ShopSetup(domain);
                    const setupResult = await shopSetup.execute();

                    // Update shop status to active
                    await prisma.shop.update({
                        where: { id: shop.id },
                        data: {
                            domain

                        }
                    });

                    return shop;
                } catch (setupError) {
                    // Automatic rollback of DB transaction will occur
                    console.error('Shop setup failed:', setupError);
                    throw new Error('Failed to setup shop folder structure');
                }
            });

            return res.status(201).json({
                message: 'Shop registered and setup successfully.',
                status: "success",
                shop: newShop
            });

        } else if (mode === "update") {
            const existingShop = await prisma.shop.findFirst({
                where: { merchantId: merchant.id }
            });

            if (!existingShop) {
                return next(new httpError("Shop not found. You need to register it first.", 404));
            }

            // For updates, we only handle folder structure if domain changed
            const oldPath = path.join(__dirname, '..', '..', 'frontend', 'app', existingShop.domain)
            const newPath = path.join(__dirname, '..', '..', 'frontend', 'app', domain)
            if (existingShop.domain) {
                try {
                    // First try to close any possible file handles
                    await fs.access(oldPath);
                    await fs.rename(oldPath, newPath);
                } catch (renameError) {
                    console.error('Failed to rename shop folder:', renameError);
                    return next(new httpError('Failed to rename shop folder', 500));
                }
            }

            // Update other shop details
            const updatedShop = await prisma.shop.update({
                where: { id: existingShop.id },
                data: {
                    name: name || existingShop.name,
                    slug: slug || existingShop.slug,
                    description: description || existingShop.description,
                    merchantTemplateId: merchantTemplateId || existingShop.merchantTemplateId,
                    logoImageUrl: req.file ? req.file.filename : existingShop.logoImageUrl
                }
            });

            return res.status(200).json({
                message: 'Shop updated successfully.',
                status: "success",
                shop: updatedShop
            });
        }

    } catch (error) {
        console.error('Register/Update Shop Error:', error);
        return next(new httpError(error.message || "Server error. Please try again later.", 500));
    }
};
const getAllShop = async (req, res, next) => {

    try {
        // await prisma.shop.deleteMany()
        const shops = await prisma.shop.findMany()
        if (shops.length === 0) {
            return res.status(200).json({
                status: 'success',
                shops: []
            })
        }
        res.status(200).json({
            status: 'success',
            shops
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const getById = async (req, res, next) => {
    const { shopId } = req.params
    try {
        const pages = await prisma.basePage.findMany()
        const shop = await prisma.shop.findFirst({
            where: {
                id: shopId
            },
        })
        res.status(200).json({ shop, pages })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}
const getShopByAccount = async (req, res, next) => {
    const { accountId } = req.params
    try {
        const merchant = await prisma.merchant.findFirst({
            where: {
                accountId
            }
        })
        if (!merchant) {
            return res.status(404).json({
                status: 'Success',
                merchant: {}
            })
        }
        const shop = await prisma.shop.findFirst({
            where: {
                merchantId: merchant.id
            },
        })

        res.status(200).json({
            status: 'success',
            shop: shop ? shop : {}
        })
    } catch (error) {
        next(new httpError(error.message, 500))
    }
}

module.exports = {
    registerShop,
    getAllShop,
    getById,
    getShopByAccount,
}