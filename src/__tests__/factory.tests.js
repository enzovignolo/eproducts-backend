/**
 * Here we will test factory services funcionallity
 */

const factoryServices = require('../../src/services/factoryServices');
const productModel = require('../../src/models/productsModel');
const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/test';
//jest.useFakeTimers();
beforeAll(async () => {
    await mongoose.connection.close();
    return await mongoose.connect(DB_URI, { useNewUrlParser: true });
       
  
});
afterEach(async()=>await productModel.deleteMany({}))
afterAll(async()=> {
  
  return await mongoose.connection.close()})
describe('Testing product services', (done) => {


      it('Debe devolver poducto',async()=>{
       
        try {
          
          const productMock = {
              name : "Product mock",
              category:"Category mock",
              stock:22,
              price:200,
              thumbnail:"mock.jpg"
          }
          const productAdded = await productModel.create(productMock);
          const resultTest = await factoryServices.getOne(productAdded._id,productModel);
          
          expect(resultTest.name).toBe(productMock.name);
          expect(resultTest.stock).toBe(productMock.stock)
                 
        } catch (err) {
          console.log(err);
          expect(err).toMatch('error');
        }
       

          
          
      
        })
        it('Debe arrojar ERROR en producto buscado',async()=>{
          try {
            const productMock = {
              name : "Product mock",
              category:"Category mock",
              stock:22,
              price:200,
              thumbnail:"mock.jpg"
          }
          const productAdded = await productModel.create(productMock);
          const resultTest = await factoryServices.getOne('asdddd',productModel);
          
            
          } catch (err) {
         
          expect(err.name).toMatch('CastError');
            
          }
        })
        it('Debe devolver array de productos',async()=>{

          try {
            const productMock = {
              name : "Product mock",
              category:"Category mock",
              stock:22,
              price:200,
              thumbnail:"mock.jpg"
          }
            for(let i=0;i<10;i++){
            const productAdded = await productModel.create(productMock);
          }
          const resultTest = await factoryServices.getAll(false,productModel);
          expect(resultTest.length).toBe(10);

            
          } catch (err) {
            console.log(err.message)
            expect(err.message).toMatch('error')
            
          }
        })
        it('Debe actualizar al producto',async()=>{
          try {
            const productMock = {
              name : "Product mock",
              category:"Category mock",
              stock:22,
              price:200,
              thumbnail:"mock.jpg"
          }
          const productAdded = await productModel.create(productMock);

          const resultTest = await factoryServices.updateOne(productAdded._id,{name:"update test",price:5},productModel);
          
          expect(resultTest.name).toBe('update test');
          expect(resultTest.price).toBe(5)
            
          } catch (err) {
            expext(err).toMatch('err');
            
          }
        })
        it('Debe borrar un producto por id',async()=>{
          try {
            const productMock = {
              name : "Product mock",
              category:"Category mock",
              stock:22,
              price:200,
              thumbnail:"mock.jpg"
          }
          const productAdded = await productModel.create(productMock);
          await factoryServices.deleteOne(productAdded._id,productModel);
          const allProducts = await productModel.find({});
          expect(allProducts.length).toEqual(0);
          expect(await productModel.findById(productAdded._id)).toThrow(TypeError);  
          } catch (err) {
            console.log('aaaaa',err);
            expect(err.name).toMatch('Error')
            
          }
        })
      



});
