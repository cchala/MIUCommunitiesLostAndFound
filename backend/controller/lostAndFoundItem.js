// add lost item , it will check if the lost item reported before add to it.
exports.addLostItems = (req, res, next) => {
    console.log("123")
    console.log(req.body)
    req.db.collection("lostAndFound").findOne({ uIdentifer: req.body.uIdentifer })
        .then((response) => {
            console.log(response, "nnnn")
            if (!response) {
                let itemObj = {
                    nameOfProduct: req.body.nameOfProduct,
                    model: req.body.model,
                    //image:url,
                    uIdentifer: req.body.uIdentifer,
                    lastSeenDate: new Date(req.body.lastSeenDate),
                    addedDate: new Date(),
                    isLost: true,
                    description: req.body.description,
                    isClaimed: false,
                    owner: {
                        firstName: req.body.owner.firstName,
                        lastName: req.body.owner.lastName,
                        cellPhone: req.body.owner.cellPhone,
                        email: req.body.owner.email
                    }
                }
                req.db.collection("lostAndFound").insertOne(itemObj).then(data => {
                    console.log(data)
                    res.status(201).json({ status: "success", result: data })
                })
            } else if (response.isLost) {
                //move to claim
                res.status(200).json({ status: "Item reported" })
            }
        }).catch((err) => {
            res.json({ status: "error" });
        })
  
  }
  // to add found item before that it will check if reported as lost
  exports.addFoundItems = (req, res, next) => {
    console.log("found item")
    console.log(req.body)
    req.db.collection("lostAndFound").findOne({ uIdentifer: req.body.uIdentifer })
        .then((response) => {
            console.log(response, "nnnn")
            if (response) {
                req.db.collection("lostAndFound").updateOne({ uIdentifer: response.uIdentifer }, {
                    $set: {
                        isLost: false,
                    }
                }).then((respo) => {
                    res.json({ status: "The item have owner", result: respo })
                }).catch((err) => { res.json({ status: "error", err }); })
            } else {
                let itemObj = {
                    nameOfProduct: req.body.nameOfProduct,
                    model: req.body.model,
                    //image:url,
                    uIdentifer: req.body.uIdentifer,
                    lastSeenDate: null,
                    addedDate: new Date(),
                    isLost: false,
                    description: req.body.description,
                    isClaimed: false,
                    owner: null
                }
                req.db.collection("lostAndFound").insertOne(itemObj).then((data) => {
                    res.status(201).json({ status: "success", result: data })
                })
            }
        }).catch((err) => {
            res.json({ status: "error" });
        })
  
  }
  
  //claim for lost and posted 
  exports.claimLostOrFoundItems = (req, res, next) => {
    console.log(req.params)
    req.db.collection("lostAndFound").findOne({ uIdentifer: req.params.uIdentifer })
        .then((resp) => {
            console.log(resp.isLost)
            if (resp.isLost) {
                req.db.collection("lostAndFound").findOneAndUpdate({ uIdentifer: resp.uIdentifer }, {
                    $set: {
                        isClaimed: true,
                    }
                }).then((data) => {
                    console.log(data)
                    if (data.value) res.status(200).json({ status: "claimed", result: data })
                    res.status(400).json({ status: "something wrong", result: data })
                }).catch((err) => {
                    res.json({ status: "error" });
                })
            } else if (!resp.owner) {
                req.db.collection("lostAndFound").findOneAndUpdate({ uIdentifer: req.params.uIdentifer }, {
                    $set: {
                        isClaimed: true,
                        owner: {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            cellPhone: req.body.cellPhone,
                            email: req.body.email
                        }
                    }
                }).then((data) => {
                    console.log(data)
                    if (data.value) res.status(200).json({ status: "claimed with owner", result: data })
                    res.status(400).json({ status: "wrong lost item claim" })
                }).catch((err) => {
                    res.json({ status: "error", err });
                })
            } else {
                res.json({ status: "Already claimed by the owner" })
            }
        }).catch((err) => {
            res.json({ status: "error", err });
        })
  }