const express = require("express");
const router = express.Router();
const {
  sequelize,
  category_field,
  field_type,
  option,
} = require("../database/database");

// Get all category_fields
router.get("/", async (req, res) => {
  try {
    const category_fields = await category_field.findAll({
      include: [
        {
          model: field_type,
          as: "field_type",
        },
        {
          model: option,
          as: "options",
        },
      ],
    });
    res.send(category_fields);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get category_field by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryField = await category_field.findByPk(req.params.id, {
      include: [
        {
          model: field_type,
          as: "field_type",
        },
        {
          model: option,
          as: "options",
        },
      ],
    });
    if (categoryField) {
      res.send(categoryField);
    } else {
      res.status(404).send({ message: "Category field not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get all fields for a specific category
router.get("/category/:id", async (req, res) => {
  try {
    const category_fields = await category_field.findAll({
      where: {
        category_id: req.params.id,
      },
      include: [
        {
          model: field_type,
          as: "field_type",
        },
        {
          model: option,
          as: "options",
        },
      ],
    });
    if (category_fields) {
      res.send(category_fields);
    } else {
      res.status(404).send({ message: "Category fields not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create new category_field
router.post("/", async (req, res) => {
  const { category_id, field_name, field_type_id, options } = req.body;
  if (!category_id || !field_name || !field_type_id) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  const t = await sequelize.transaction();
  try {
    const newCategoryField = await category_field.create(
      { category_id, field_name, field_type_id },
      { transaction: t }
    );

    if (options && options.length > 0) {
      for (const optionName of options) {
        await option.create(
          {
            category_field_id: newCategoryField.id,
            name: optionName,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    res.status(201).send(newCategoryField);
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
});

// Update category_field by ID
router.put("/:id", async (req, res) => {
  const { category_id, field_name, field_type_id, options } = req.body;

  const t = await sequelize.transaction();
  try {
    const updatedCategoryField = await category_field.update(
      { category_id, field_name, field_type_id },
      {
        where: {
          id: req.params.id,
        },
        transaction: t,
      }
    );

    if (options && options.length > 0) {
      for (const optionName of options) {
        await option.create(
          {
            category_field_id: req.params.id,
            name: optionName,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    if (updatedCategoryField[0] === 0) {
      res.status(404).send({ message: "Category field not found" });
    } else {
      res.send({ message: "Category field updated successfully" });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
});

// Delete category_field by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategoryField = await category_field.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedCategoryField) {
      res.send({ message: "Category field deleted successfully" });
    } else {
      res.status(404).send({ message: "Category field not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
