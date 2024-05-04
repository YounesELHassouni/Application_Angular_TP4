import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  constructor(private productservice:ProductService,private router:Router,public appState:AppStateService) {
  }

  ngOnInit(): void {
    this.searchProducts();
  }
  searchProducts(){
    //this.appState.setProductState({status:"LOADING"});
    this.productservice.searchProducts(this.appState.productState.keyword,this.appState.productState.currentPage,this.appState.productState.pageSize)
      .subscribe({
        next: (resp) =>{
          let products = resp.body as Product [];
          let totalProducts : number = parseInt(resp.headers.get('x-total-count')!);
          //this.appState.productState.totalProducts = totalProducts;
          let totalPages
            = Math.floor(totalProducts / this.appState.productState.pageSize);
          if(totalProducts % this.appState.productState.pageSize != 0)
            totalPages+=1;
          this.appState.setProductState({
            products :products,
            totalProducts : totalProducts,
            totalPages:totalPages,
            status:"LOADED"
          })
        },
        error: err=>{
          console.log(err);
          this.appState.setProductState({
            status:"ERROR",
            errorMessage:err
          });
        }
      });
    //this.products$= this.productservice.getProducts();
  }
  handleCheckProduct(product: Product) {
    this.productservice.checkProduct(product).subscribe({
      next:updatedProduct=>{
        product.checked = !product.checked
      }
    })
    //product.checked = ! product.checked;
  }

  handleDelete(product: Product) {
    if(confirm("etes vous sûre ?"))
    this.productservice.deleteProduct(product).subscribe({
      next:value=>{
        //this.getProducts();
        //this.appState.productState.products = this.appState.productState.products.filter( (p:any) =>p.id!=product.id );
        this.searchProducts();
      }
    })
  }


  handleGoToPage(page: number) {
    this.appState.setProductState({
      currentPage:page
    });
    this.searchProducts();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`);
  }
}
