const { models } = require('./testSetup');

const { Category } = models;

describe('Category Model', () => {
  test('should create a category with valid data', async () => {
    const categoryData = {
      name: 'Electronics',
      description: 'Electronic devices and gadgets'
    };

    const category = await Category.create(categoryData);

    expect(category.id).toBeDefined();
    expect(category.name).toBe('Electronics');
    expect(category.description).toBe('Electronic devices and gadgets');
    expect(category.isActive).toBe(true);
  });

  test('should require name field', async () => {
    const categoryData = {
      description: 'Category without name'
    };

    await expect(Category.create(categoryData)).rejects.toThrow();
  });

  test('should update category fields', async () => {
    const category = await Category.create({
      name: 'Old Category',
      description: 'Old description'
    });

    await category.update({
      name: 'Updated Category',
      description: 'Updated description',
      isActive: false
    });

    expect(category.name).toBe('Updated Category');
    expect(category.description).toBe('Updated description');
    expect(category.isActive).toBe(false);
  });
});