import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsComponent} from "../products/products.component";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{
  public productForm!: FormGroup;
  constructor(private fb: FormBuilder , private productservice : ProductService) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group(
      {
        name : this.fb.control('',[Validators.required]),
        price : this.fb.control('',[Validators.required]),
        checked : this.fb.control(false),
      }
    )
  }


  saveProduct() {
    let product:Product = this.productForm.value;
    this.productservice.saveProduct(product).subscribe({
      next: data=>{
        alert(JSON.stringify(data));
      },
      error : err=>{
        console.log(err);
    }
    });
  }
}
