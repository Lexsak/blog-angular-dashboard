import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg: any;

  categories: any = [];

  postForm: FormGroup = new FormGroup({});

  post: any;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postSerivce: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.postSerivce.loadOneData(val['id']).subscribe((post) => {
        this.post = post;

        this.postForm = this.fb.group({
          title: [
            this.post.title,
            [Validators.required, Validators.minLength(10)],
          ],
          permalink: [this.post.permalink, Validators.required],
          exerpt: [
            this.post.exerpt,
            [Validators.required, Validators.minLength(50)],
          ],
          category: [
            `${this.post.category.categoryId}-${this.post.category.category}`,
            Validators.required,
          ],
          postImg: ['', Validators.required],
          content: [this.post.content, Validators.required],
        });

        this.imgSrc = this.post.postImgPath
      });
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged() {
    this.postForm.get('title')?.valueChanges.subscribe((title) => {
      if (title !== null && title !== undefined) {
        this.permalink = title.replace(/\s/g, '-');
        this.postForm.get('permalink')?.setValue(this.permalink);
      }
    });
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };

    reader.readAsDataURL($event?.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    console.log(this.postForm.value);

    let splitted = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      exerpt: this.postForm.value.exerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    this.postSerivce.uploadImage(this.selectedImg, postData);
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.png';
  }
}
