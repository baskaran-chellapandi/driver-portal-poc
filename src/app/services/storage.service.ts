import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage;

  constructor(private storage: Storage) {
    this.init();
  }

  /* 
  * Creating storage 
  */
  async init() {
    if (this._storage != null) {
      return;
    }
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /* 
  * Store the value with key value pair
  */
  public async set(key: string, value: any) {
    await this.init();
    return this._storage?.set(key, value);
  }

  /* 
  * Get the stored value using key
  */
  public async get(key: string) {
    await this.init();
    return await this._storage?.get(key);
  }

  /* 
  * Remove the stored value using key
  */
  public async remove(key: string) {
    return await this._storage.remove(key);
  }

  /* 
  * Clear the overall storage
  */
  public async clear() {
    return await this._storage.clear();
  }
}