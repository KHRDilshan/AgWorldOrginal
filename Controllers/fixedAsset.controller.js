const { response } = require('express');
const db = require('../startup/database');



// Add a fixed asset
exports.addFixedAsset = (req, res) => {
    const userId = req.user.id; // Retrieve userId from req.user.id
    const {
        category,
        ownership,
        type,
        floorArea,
        generalCondition,
        district,
        extentha,
        extentac,
        extentp,
        landFenced,
        perennialCrop,
        asset,
        assetType,
        mentionOther,
        brand,
        numberOfUnits,
        unitPrice,
        totalPrice,
        warranty,
        issuedDate,
        purchaseDate,
        expireDate,
        warrantystatus,
        startDate,
        durationYears,
        durationMonths,
        leastAmountAnnually,
        permitFeeAnnually,
        paymentAnnually,
        estimateValue
    } = req.body;

    console.log(req.body);

    // Format all required date fields
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const formattedPurchaseDate = purchaseDate ? formatDate(purchaseDate) : null;
    const formattedExpireDate = expireDate ? formatDate(expireDate) : null;
    const formattedIssuedDate = issuedDate ? formatDate(issuedDate) : null;
    const formattedStartDate = startDate ? formatDate(startDate) : null;


    // Start a transaction
db.beginTransaction((err) => {
    if (err) {
        return res.status(500).json({ message: 'Transaction error', error: err });
    }

    // Insert into fixedasset table
    const fixedAssetSql = `INSERT INTO fixedasset (userId, category) VALUES (?, ?)`;
    db.query(fixedAssetSql, [userId, category], (fixedAssetErr, fixedAssetResult) => {
        if (fixedAssetErr) {
            return db.rollback(() => {
                return res.status(500).json({ message: 'Error inserting into fixedasset table', error: fixedAssetErr });
            });
        }

        const fixedAssetId = fixedAssetResult.insertId;
        console.log("Fixed asset id:", fixedAssetId);

        // Handle category 'Building and Infrastructures'
        if (category === 'Building and Infrastructures') {
            const buildingSql = `INSERT INTO buildingfixedasset (fixedAssetId, type, floorArea, ownership, generalCondition, district)
                                 VALUES (?, ?, ?, ?, ?, ?)`;

            db.query(buildingSql, [fixedAssetId, type, floorArea, ownership, generalCondition, district], (buildingErr, buildingResult) => {
                if (buildingErr) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error inserting into buildingfixedasset table', error: buildingErr });
                    });
                }

                const buildingAssetId = buildingResult.insertId;
                console.log("Building asset id:", buildingAssetId);

                // Ownership condition handling
                if (ownership === 'Own Building (with title ownership)') {
                    const formattedIssuedDate = new Date(issuedDate).toISOString().split('T')[0];

                    const ownershipSql = `INSERT INTO ownershipownerfixedasset (buildingAssetId, issuedDate, estimateValue)
                                          VALUES (?, ?, ?)`;

                    db.query(ownershipSql, [buildingAssetId, formattedIssuedDate, estimateValue], (ownershipErr, ownershipResult) => {
                        if (ownershipErr) {
                            console.error('Error details:', ownershipErr);
                            return db.rollback(() => {
                                return res.status(500).json({ message: 'Error inserting into ownershipownerfixedasset table', error: ownershipErr });
                            });
                        }

                        // Commit the transaction after successful insertion
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    return res.status(500).json({ message: 'Commit error', error: commitErr });
                                });
                            }
                            return res.status(201).json({ message: 'Building fixed asset with ownership created successfully.' });
                        });
                    });

                } else if (ownership === 'Leased Building') {
                    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];

                    const leaseSql = `INSERT INTO ownershipleastfixedasset (buildingAssetId, startDate, durationYears, durationMonths, leastAmountAnnually)
                                      VALUES (?, ?, ?, ?, ?)`;

                    db.query(leaseSql, [buildingAssetId, formattedStartDate, durationYears, durationMonths, leastAmountAnnually], (leaseErr) => {
                        if (leaseErr) {
                            console.error('Error details:', leaseErr);
                            return db.rollback(() => {
                                return res.status(500).json({ message: 'Error inserting into ownershipleastfixedasset table', error: leaseErr });
                            });
                        }

                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    return res.status(500).json({ message: 'Commit error', error: commitErr });
                                });
                            }
                            return res.status(201).json({ message: 'Building fixed asset with lease ownership created successfully.' });
                        });
                    });

                } else if (ownership === 'Permit Building') {
                    const formattedIssuedDate = new Date(issuedDate).toISOString().split('T')[0];

                    const permitSql = `INSERT INTO ownershippermitfixedasset (buildingAssetId, issuedDate, permitFeeAnnually)
                                       VALUES (?, ?, ?)`;

                    db.query(permitSql, [buildingAssetId, formattedIssuedDate, permitFeeAnnually], (permitErr) => {
                        if (permitErr) {
                            console.error('Error details:', permitErr);
                            return db.rollback(() => {
                                return res.status(500).json({ message: 'Error inserting into ownershippermitfixedasset table', error: permitErr });
                            });
                        }

                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    return res.status(500).json({ message: 'Commit error', error: commitErr });
                                });
                            }
                            return res.status(201).json({ message: 'Building fixed asset with permit ownership created successfully.' });
                        });
                    });

                } else if (ownership === 'Shared / No Ownership') {
                    const sharedSql = `INSERT INTO ownershipsharedfixedasset (buildingAssetId, paymentAnnually)
                                       VALUES (?, ?)`;

                    db.query(sharedSql, [buildingAssetId, paymentAnnually], (sharedErr) => {
                        if (sharedErr) {
                            console.error('Error details:', sharedErr);
                            return db.rollback(() => {
                                return res.status(500).json({ message: 'Error inserting into ownershipsharedfixedasset table', error: sharedErr });
                            });
                        }

                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    return res.status(500).json({ message: 'Commit error', error: commitErr });
                                });
                            }
                            return res.status(201).json({ message: 'Building fixed asset with shared ownership created successfully.' });
                        });
                    });

                } else {
                    return db.rollback(() => {
                        return res.status(400).json({ message: 'Invalid ownership type provided for building asset.' });
                    });
                }
            });
        } else {
            // Handle other categories as needed
            return db.rollback(() => {
                return res.status(400).json({ message: 'Invalid category provided.' });
            });
        }
    });
});


//------------------------------------------------------------------------------------------------------------------------------------

exports.getFixedAssetsByCategory = (req, res) => {
    const userId = req.user.id; // Retrieve the userId from req.user.id
    const { category } = req.params; // Get the category from request parameters

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        let sqlQuery = '';
        let queryParams = [userId]; // Initialize with userId

        // Determine which SQL to run based on category
        if (category === 'Land') {
            sqlQuery = `SELECT fa.id, fa.category, lfa.district
                        FROM fixedasset fa
                        JOIN landfixedasset lfa ON fa.id = lfa.fixedAssetId
                        WHERE fa.userId = ?`;
        } else if (category === 'Building and Infrastructures') {
            sqlQuery = `SELECT fa.id, fa.category, bfa.type
                        FROM fixedasset fa
                        JOIN buildingfixedasset bfa ON fa.id = bfa.fixedAssetId
                        WHERE fa.userId = ?`;
        } else if (category === 'Machine and Vehicles' || category === 'Tools') {
            sqlQuery = `SELECT fa.id, fa.category, mtfa.assetType
                        FROM fixedasset fa
                        JOIN machtoolsfixedasset mtfa ON fa.id = mtfa.fixedAssetId
                        WHERE fa.userId = ?`;
        } else {
            return res.status(400).json({ message: 'Invalid category provided.' });
        }

        // Execute the query based on the category
        db.query(sqlQuery, queryParams, (queryErr, results) => {
            if (queryErr) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error retrieving fixed assets', error: queryErr });
                });
            }

            // Commit the transaction and return the results
            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Commit error', error: commitErr });
                    });
                }
                return res.status(200).json({ message: 'Fixed assets retrieved successfully.', data: results });
            });
        });
    });
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//controller for get details for updating fixed assets
exports.getFixedAssetDetailsById = (req, res) => {
    const userId = req.user.id; // Retrieve userId from req.user.id
    const { assetId, category } = req.params; // Get the assetId and category from request parameters

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        let sqlQuery = '';
        let ownershipQuery = '';
        let queryParams = [userId, assetId]; // Initialize with userId and assetId

        // Determine which SQL query to run based on category
        if (category === 'Land') {
            sqlQuery = `
                SELECT fa.id, fa.category, lfa.district, lfa.extentha, lfa.extentac, lfa.extentp, lfa.ownership, lfa.landFenced, lfa.perennialCrop
                FROM fixedasset fa
                JOIN landfixedasset lfa ON fa.id = lfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            ownershipQuery = `
                SELECT 
                    oof.issuedDate, oof.estimateValue, 
                    olf.startDate, olf.durationYears, olf.leastAmountAnnually,
                    opf.permitFeeAnnually, 
                    osf.paymentAnnually
                FROM ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.landAssetId = olf.landAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.landAssetId = opf.landAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.landAssetId = osf.landAssetId
                WHERE oof.landAssetId = ?`;

        } else if (category === 'Building and Infrastructures') {
            sqlQuery = `
                SELECT fa.id, fa.category, bfa.type, bfa.floorArea, bfa.ownership, bfa.generalCondition, bfa.district
                FROM fixedasset fa
                JOIN buildingfixedasset bfa ON fa.id = bfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            ownershipQuery = `
                SELECT 
                    oof.issuedDate, oof.estimateValue, 
                    olf.startDate, olf.durationYears, olf.leastAmountAnnually,
                    opf.permitFeeAnnually, 
                    osf.paymentAnnually
                FROM ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.buildingAssetId = olf.buildingAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.buildingAssetId = opf.buildingAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.buildingAssetId = osf.buildingAssetId
                WHERE oof.buildingAssetId = ?`;

        } else if (category === 'Machine and Vehicles' || category === 'Tools') {
            sqlQuery = `
                SELECT fa.id, fa.category, mtfa.asset, mtfa.assetType, mtfa.mentionOther, mtfa.brand, mtfa.numberOfUnits, mtfa.unitPrice, mtfa.totalPrice, mtfa.warranty
                FROM fixedasset fa
                JOIN machtoolsfixedasset mtfa ON fa.id = mtfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            ownershipQuery = `
                SELECT 
                    mtw.purchaseDate, mtw.expireDate, mtw.warrantystatus
                FROM machtoolsfixedassetwarranty mtw
                WHERE mtw.machToolsId = ?`;

         } else {
            return res.status(400).json({ message: 'Invalid category provided.' });
        }

        // Execute the main asset query
        db.query(sqlQuery, queryParams, (queryErr, assetResults) => {
            if (queryErr) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error retrieving asset details', error: queryErr });
                });
            }

            if (assetResults.length === 0) {
                return res.status(404).json({ message: 'Asset not found.' });
            }

            const asset = assetResults[0];
            const assetOwnershipId = asset.id; // Assuming the asset's ID links to ownership

            // Execute the ownership query based on the asset type
            db.query(ownershipQuery, [assetOwnershipId], (ownershipErr, ownershipResults) => {
                if (ownershipErr) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error retrieving ownership details', error: ownershipErr });
                    });
                }

                asset.ownershipDetails = ownershipResults[0] || null;

                // Commit the transaction and return the asset details with ownership
                db.commit((commitErr) => {
                    if (commitErr) {
                        return db.rollback(() => {
                            return res.status(500).json({ message: 'Commit error', error: commitErr });
                        });
                    }
                    // return res.status(200).json({ message: 'Asset details retrieved successfully.', data: asset });
                    return res.status(200).json( asset );
                });
            });
        });
    });
};



//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//updating fixed assets
exports.updateFixedAsset = (req, res) => {
    const userId = req.user.id; // Retrieve userId from req.user.id
    const { assetId, category } = req.params; // Get assetId and category from request parameters
    const assetData = req.body; // Data to update (sent in request body)

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        let updateAssetQuery = '';
        let updateOwnershipQuery = '';
        let updateParams = [];
        let ownershipParams = [];

        // Prepare the update query based on the asset category
        if (category === 'Land') {
            updateAssetQuery = `
                UPDATE landfixedasset lfa
                JOIN fixedasset fa ON fa.id = lfa.fixedAssetId
                SET lfa.district = COALESCE(NULLIF(?, ''), lfa.district),
                    lfa.extentha = COALESCE(NULLIF(?, ''), lfa.extentha),
                    lfa.extentac = COALESCE(NULLIF(?, ''), lfa.extentac),
                    lfa.extentp = COALESCE(NULLIF(?, ''), lfa.extentp),
                    lfa.ownership = COALESCE(NULLIF(?, ''), lfa.ownership),
                    lfa.landFenced = COALESCE(NULLIF(?, ''), lfa.landFenced),
                    lfa.perennialCrop = COALESCE(NULLIF(?, ''), lfa.perennialCrop)
                WHERE fa.userId = ? AND fa.id = ?`;
        
            updateParams = [
                assetData.district,
                assetData.extentha,
                assetData.extentac,
                assetData.extentp,
                assetData.ownership,
                assetData.landFenced,
                assetData.perennialCrop,
                userId,
                assetId
            ];
        
            // Ownership query for Land
            updateOwnershipQuery = `
                UPDATE ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.landAssetId = olf.landAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.landAssetId = opf.landAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.landAssetId = osf.landAssetId
                SET oof.issuedDate = COALESCE(NULLIF(?, ''), oof.issuedDate),
                    oof.estimateValue = COALESCE(NULLIF(?, ''), oof.estimateValue),
                    olf.startDate = COALESCE(NULLIF(?, ''), olf.startDate),
                    olf.durationYears = COALESCE(NULLIF(?, ''), olf.durationYears),
                    olf.leastAmountAnnually = COALESCE(NULLIF(?, ''), olf.leastAmountAnnually),
                    opf.permitFeeAnnually = COALESCE(NULLIF(?, ''), opf.permitFeeAnnually),
                    osf.paymentAnnually = COALESCE(NULLIF(?, ''), osf.paymentAnnually)
                WHERE oof.landAssetId = ?`;
        
            // Ensure ownershipDetails is defined before accessing its properties
            ownershipParams = [
                assetData.ownershipDetails ? assetData.ownershipDetails.issuedDate : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.estimateValue : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.startDate : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.durationYears : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.leastAmountAnnually : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.permitFeeAnnually : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.paymentAnnually : null,
                assetId
            ];
        }
        
        else if (category === 'Building and Infrastructures') {
            updateAssetQuery = `
                UPDATE buildingfixedasset bfa
                JOIN fixedasset fa ON fa.id = bfa.fixedAssetId
                SET bfa.type = COALESCE(NULLIF(?, ''), bfa.type),
                    bfa.floorArea = COALESCE(NULLIF(?, ''), bfa.floorArea),
                    bfa.ownership = COALESCE(NULLIF(?, ''), bfa.ownership),
                    bfa.generalCondition = COALESCE(NULLIF(?, ''), bfa.generalCondition),
                    bfa.district = COALESCE(NULLIF(?, ''), bfa.district)
                WHERE fa.userId = ? AND fa.id = ?`;
        
            updateParams = [
                assetData.type,
                assetData.floorArea,
                assetData.ownership,
                assetData.generalCondition,
                assetData.district,
                userId,
                assetId
            ];
        
            // Ownership query for Building and Infrastructures
            updateOwnershipQuery = `
                UPDATE ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.buildingAssetId = olf.buildingAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.buildingAssetId = opf.buildingAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.buildingAssetId = osf.buildingAssetId
                SET oof.issuedDate = COALESCE(NULLIF(?, ''), oof.issuedDate),
                    oof.estimateValue = COALESCE(NULLIF(?, ''), oof.estimateValue),
                    olf.startDate = COALESCE(NULLIF(?, ''), olf.startDate),
                    olf.durationYears = COALESCE(NULLIF(?, ''), olf.durationYears),
                    olf.leastAmountAnnually = COALESCE(NULLIF(?, ''), olf.leastAmountAnnually),
                    opf.permitFeeAnnually = COALESCE(NULLIF(?, ''), opf.permitFeeAnnually),
                    osf.paymentAnnually = COALESCE(NULLIF(?, ''), osf.paymentAnnually)
                WHERE oof.buildingAssetId = ?`;
        
            // Ensure ownershipDetails is defined before accessing its properties
            ownershipParams = [
                assetData.ownershipDetails ? assetData.ownershipDetails.issuedDate : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.estimateValue : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.startDate : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.durationYears : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.leastAmountAnnually : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.permitFeeAnnually : null,
                assetData.ownershipDetails ? assetData.ownershipDetails.paymentAnnually : null,
                assetId
            ];
        }
         else if (category === 'Machine and Vehicles' || category === 'Tools') {
            // Check if assetType is 'Other' to validate additional fields
            if (assetData.assetType === 'Other') {
                // Ensure that all mandatory fields for 'Other' are provided
                if (!assetData.mentionOther) {
                    return res.status(400).json({ message: 'Mention other field is required when assetType is "Other"' });
                }
        
                updateAssetQuery = `
                    UPDATE machtoolsfixedasset mtfa
                    JOIN fixedasset fa ON fa.id = mtfa.fixedAssetId
                    SET 
                        mtfa.asset = ?, 
                        mtfa.assetType = ?, 
                        mtfa.mentionOther = ?, 
                        mtfa.brand = ?, 
                        mtfa.numberOfUnits = ?, 
                        mtfa.unitPrice = ?, 
                        mtfa.totalPrice = ?, 
                        mtfa.warranty = ?
                    WHERE 
                        fa.userId = ? AND fa.id = ?`;
        
                updateParams = [
                    assetData.asset,
                    assetData.assetType,
                    assetData.mentionOther,
                    assetData.brand,
                    assetData.numberOfUnits,
                    assetData.unitPrice,
                    assetData.totalPrice,
                    assetData.warranty,
                    userId,
                    assetId
                ];
        
                // Ownership query for Machine and Vehicles (warranty update)
                updateOwnershipQuery = `
                    UPDATE machtoolsfixedassetwarranty mtw
                    SET 
                        mtw.purchaseDate = ?, 
                        mtw.expireDate = ?, 
                        mtw.warrantystatus = ?
                    WHERE 
                        mtw.machToolsId = ?`;
        
                ownershipParams = [
                    assetData.ownershipDetails.purchaseDate,
                    assetData.ownershipDetails.expireDate,
                    assetData.ownershipDetails.warrantystatus,
                    assetId
                ];
        
            } else {
                // If assetType is not 'Other', proceed without mentioning the other field
                updateAssetQuery = `
                    UPDATE machtoolsfixedasset mtfa
                    JOIN fixedasset fa ON fa.id = mtfa.fixedAssetId
                    SET 
                        mtfa.asset = ?, 
                        mtfa.assetType = ?, 
                        mtfa.brand = ?, 
                        mtfa.numberOfUnits = ?, 
                        mtfa.unitPrice = ?, 
                        mtfa.totalPrice = ?, 
                        mtfa.warranty = ?
                    WHERE 
                        fa.userId = ? AND fa.id = ?`;
        
                updateParams = [
                    assetData.asset,
                    assetData.assetType,
                    assetData.brand,
                    assetData.numberOfUnits,
                    assetData.unitPrice,
                    assetData.totalPrice,
                    assetData.warranty,
                    userId,
                    assetId
                ];
        
                // Ownership query for Machine and Vehicles (warranty update)
                updateOwnershipQuery = `
                    UPDATE machtoolsfixedassetwarranty mtw
                    SET 
                        mtw.purchaseDate = ?, 
                        mtw.expireDate = ?, 
                        mtw.warrantystatus = ?
                    WHERE 
                        mtw.machToolsId = ?`;
        
                ownershipParams = [
                    assetData.ownershipDetails.purchaseDate,
                    assetData.ownershipDetails.expireDate,
                    assetData.ownershipDetails.warrantystatus,
                    assetId
                ];
            }
        }
         else {
            return res.status(400).json({ message: 'Invalid category provided.' });
        }

        // Execute the update asset query
        db.query(updateAssetQuery, updateParams, (queryErr, results) => {
            if (queryErr) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error updating asset details', error: queryErr });
                });
            }

            // Execute the ownership update query
            db.query(updateOwnershipQuery, ownershipParams, (ownershipErr, ownershipResults) => {
                if (ownershipErr) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error updating ownership details', error: ownershipErr });
                    });
                }

                // Commit the transaction
                db.commit((commitErr) => {
                    if (commitErr) {
                        return db.rollback(() => {
                            return res.status(500).json({ message: 'Commit error', error: commitErr });
                        });
                    }
                    return res.status(200).json({ message: 'Asset and ownership details updated successfully.' });
                });
            });
        });
    });
};


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//delete fixed asset
exports.deleteFixedAsset = (req, res) => {
    const userId = req.user.id; // Retrieve userId from req.user.id
    const { assetId, category } = req.params; // Get assetId and category from request parameters

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        let deleteAssetQuery = '';
        let deleteOwnershipQuery = '';

        // Prepare the delete query based on the asset category
        if (category === 'Land') {
            deleteAssetQuery = `
                DELETE lfa, fa
                FROM landfixedasset lfa
                JOIN fixedasset fa ON fa.id = lfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            deleteOwnershipQuery = `
                DELETE oof, olf, opf, osf
                FROM ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.landAssetId = olf.landAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.landAssetId = opf.landAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.landAssetId = osf.landAssetId
                WHERE oof.landAssetId = ?`;
        } else if (category === 'Building and Infrastructures') {
            deleteAssetQuery = `
                DELETE bfa, fa
                FROM buildingfixedasset bfa
                JOIN fixedasset fa ON fa.id = bfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            deleteOwnershipQuery = `
                DELETE oof, olf, opf, osf
                FROM ownershipownerfixedasset oof
                LEFT JOIN ownershipleastfixedasset olf ON oof.buildingAssetId = olf.buildingAssetId
                LEFT JOIN ownershippermitfixedasset opf ON oof.buildingAssetId = opf.buildingAssetId
                LEFT JOIN ownershipsharedfixedasset osf ON oof.buildingAssetId = osf.buildingAssetId
                WHERE oof.buildingAssetId = ?`;
        } else if (category === 'Machine and Vehicles' || category === 'Tools') {
            deleteAssetQuery = `
                DELETE mtfa, fa
                FROM machtoolsfixedasset mtfa
                JOIN fixedasset fa ON fa.id = mtfa.fixedAssetId
                WHERE fa.userId = ? AND fa.id = ?`;

            deleteOwnershipQuery = `
                DELETE mtw
                FROM machtoolsfixedassetwarranty mtw
                WHERE mtw.machToolsId = ?`;
        } else {
            return res.status(400).json({ message: 'Invalid category provided.' });
        }

        // Execute the delete asset query
        db.query(deleteAssetQuery, [userId, assetId], (queryErr, results) => {
            if (queryErr) {
                return db.rollback(() => {
                    return res.status(500).json({ message: 'Error deleting asset details', error: queryErr });
                });
            }

            // Execute the ownership delete query
            db.query(deleteOwnershipQuery, [assetId], (ownershipErr, ownershipResults) => {
                if (ownershipErr) {
                    return db.rollback(() => {
                        return res.status(500).json({ message: 'Error deleting ownership details', error: ownershipErr });
                    });
                }

                // Commit the transaction
                db.commit((commitErr) => {
                    if (commitErr) {
                        return db.rollback(() => {
                            return res.status(500).json({ message: 'Commit error', error: commitErr });
                        });
                    }
                    return res.status(200).json({ message: 'Asset and ownership details deleted successfully.' });
                });
            });
        });
    });
};
