import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(selectedImage: any, postData: Post, formStatus: any, id: any) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('post image uploaded successfully');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;
          console.log(postData);

          if (formStatus == 'Edit') {
            this.updateData(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData: Post) {
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Data Insert Successfully');
        this.router.navigate(['/posts']);
      });
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return { id, data };
          });
        })
      );
  }
  loadOneData(id: any) {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: any, postData: any) {
    this.afs
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Data Updated Successfully');
        this.router.navigate(['/posts']);
      });
  }

  deleteImage(postImgPath: string, id: string) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id: string) {
    this.afs
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning('Data Deleted..!');
      });
  }

  markFeatured(id: string, featuredData: any) {
    this.afs
      .doc(`posts/${id}`)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured Status Updated');
      });
  }
}
