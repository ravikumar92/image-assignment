const express = require("express");
const imageRouter = express.Router();

imageRouter.get("/", async (req, res) => {
    const dbClient = req.dbClient;
    try{
        const query = await dbClient.query(`SELECT * FROM images where is_active = $1`, [true]);
        res.status(200).send({
            "message": "Image fetch sucessfully",
            data: query.rows
        })
        } catch(err) {
            res.status(500).send({
                "error": "An error occurred while fetching the image"
            })
        }   
})

imageRouter.get("/:id(\\d+)", async (req, res) => {
    const dbClient = req.dbClient;
    const imageId = req.params.id;

    if (imageId <= 0) {
        res.status(400).send({
            "message": "please provide image id"
        })
    }
    try{
    const query = await dbClient.query(`SELECT * FROM images where is_active = $1 and id = $2`, [true, imageId]);
    res.status(200).send({
        "message": "Image fetch sucessfully",
        data: query.rows
    })
    } catch(err) {
        res.status(500).send({
            "error": "An error occurred while fetching the image"
        })
    }
})

imageRouter.post("/", async (req, res) => {
    const dbClient = req.dbClient;
    const { id, title, desc, file, noOfLikes, noOfDislikes } = req.body;
    try {
        await dbClient.query("INSERT INTO images(title, img_desc, file, no_of_like, no_of_dislike) VALUES($1,$2,$3,$4,$5) RETURNING *", [title, desc, file, noOfLikes, noOfDislikes]);
    } catch (err) {
        res.status(500).send({
            "error": err.detail
        })
        return;
    }
    res.status(201).send({
        "message": "image uploaded sucessfully."
    })
    return;
})

imageRouter.put("/:id", async (req, res) => {
    const dbClient = req.dbClient;
    const imageId = req.params.id;
    if (imageId <= 0) {
        res.status(400).send({
            "message": "please provide image id"
        })
        return;
    }
    try {
        const existedRow = await dbClient.query(`SELECT * FROM images where is_active = $1 and id = $2`, [true, imageId]);
        if (existedRow.rows.length == 0) {
            res.status(404).send({
                "message": "Image not found"
            })
            return;
        }

        const { title, desc, noOfDislikes, noOfLikes } = req.body;

        const updatedFileds = [];
        const params = [];
        let paramCount = 1;

        if (title) {
            updatedFileds.push(`title = $${paramCount++}`);
            params.push(title);
        }
        if (desc) {
            updatedFileds.push(`img_desc = $${paramCount++}`);
            params.push(desc);
        }
        if (noOfLikes > 0) {
            updatedFileds.push(`no_of_like = $${paramCount++}`);
            params.push(noOfLikes)
        }
        if (noOfDislikes > 0) {
            updatedFileds.push(`no_of_dislike = $${paramCount++}`);
            params.push(noOfDislikes)
        }
        params.push(imageId);

        const query = `UPDATE images SET ${updatedFileds.join(', ')} WHERE id = $${params.length} RETURNING *`;
        console.log(query)

        const row = await dbClient.query(query, params);
        res.status(200).send({
            "message": "image udpated sucessfully."
        })
        return;
    } catch (err) {
        console.error(err);
        res.status(500).send({
            "error": "An error occurred while updating the image"
        });
        return;
    }
})


imageRouter.delete("/:id", async (req, res) => {
    const dbClient = req.dbClient;
    const imageId = req.params.id;
    if (imageId <= 0) {
        res.status(400).send({
            "message": "please provide image id"
        })
        return;
    }
    try {
        const existedRow = await dbClient.query(`SELECT * FROM images WHERE is_active = $1 and id = $2`, [true, imageId]);
        if (existedRow.length == 0) {
            res.status(404).send({
                "message": "Image not found"
            })
            return;
        }
    
        const query = `UPDATE images SET is_active=$1 WHERE id = $2 RETURNING *`;
    
        const row = await dbClient.query(query, [false, imageId]);
        res.status(200).send({
            "message": "image deleted sucessfully."
        })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            "error": "An error occurred while deleting the image"
        });
    }
})

imageRouter.get("/analytics", async(req, res) => {
    const dbClient = req.dbClient;
    try {
        const topLikedQuery = `SELECT * FROM images where is_active = true ORDER BY no_of_like DESC LIMIT 5`;
        const topLikedResult = await dbClient.query(topLikedQuery);

        const topDislikedQuery = `SELECT * FROM images where is_active = true ORDER BY no_of_dislike DESC LIMIT 5`;
        const topDislikedResult = await dbClient.query(topDislikedQuery);

        res.status(200).json({
            "top_liked_images": topLikedResult.rows,
            "top_disliked_images": topDislikedResult.rows
        });
        return;
    } catch (error) {
        console.error("Error fetching top images:", error);
        res.status(500).json({ error: "An error occurred while fetching top images" });
        return;
    }
})

module.exports = imageRouter