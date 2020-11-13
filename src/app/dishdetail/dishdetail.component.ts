import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { subscribeOn, switchMap } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-dishdetail',
	templateUrl: './dishdetail.component.html',
	styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

	dish: Dish;
	dishIds: string[];
	prev: string;
	next: string;

	commentForm: FormGroup;
	comment?: Comment = null;
	@ViewChild('cform') commentFormDirective?: any;

	formErrors = {
		'author': '',
		'comment': ''
	};

	validationMessages = {
		'author': {
			'required': 'Name required.',
			'minlength': 'Name must be at least 2 characters long.'
		},
		'comment': {
			'required': 'Comment required.'
		}
	};

	constructor(private dishService: DishService,
		private route: ActivatedRoute,
		private location: Location,
		private fb: FormBuilder) {
		this.createCommentForm();
	}

	ngOnInit(): void {
		this.dishService.getDishIds()
			.subscribe(dishIds => this.dishIds = dishIds);
		this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
			.subscribe(dish => {
				this.dish = dish;
				this.setPrevNext(dish.id);
			});
	}

	createCommentForm(): void {
		this.commentForm = this.fb.group({
			author: ['', [Validators.required, Validators.minLength(2)]],
			rating: 5,
			comment: ['', Validators.required]
		});

		this.commentForm.valueChanges
			.subscribe(data => this.onValueChanges(data));
		
		this.onValueChanges(); // (Re)Set form validation messages
	}

	makeComment() {
		this.comment = this.commentForm.value;
		this.comment.date = new Date().toISOString();
		//console.log(this.comment);
		this.commentFormDirective.resetForm();
		this.commentForm.reset({
			author: '',
			rating: 5,
			comment: ''
		});
		this.dish.comments.push(this.comment);
	}

	onValueChanges(data?: any) {
		if (!(this.commentForm)) return;
		const form = this.commentForm;
		for (const field in this.formErrors) {
			if (this.formErrors.hasOwnProperty(field)) {
				// Clears out previous errors, if any
				this.formErrors[field] = '';
				const control = form.get(field);
				if (control && control.dirty && control.invalid) {
					const messages = this.validationMessages[field];
					for (const key in control.errors) {
						this.formErrors[field] += messages[key] + ' ';
					}
				}
			}
		}
	}

	setPrevNext(dishId: string) {
		const index = this.dishIds.indexOf(dishId);
		this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
		this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
	}

	goBack(): void { this.location.back(); }

}
