import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryArray: any[] = [];
  formCategory: string = '';
  formStatus: string = 'Add';

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      console.log(val);

      this.categoryArray = val;
    });
  }

  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category,
    };

    this.categoryService.saveData(categoryData);

    formData.reset();
  }

  onEdit(category: any) {
    this.formCategory = category
    this.formStatus = "Edit"
  }
}
