"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

// Reusable Form Component
export function CustomForm({ fields, schema, onSubmit, file, setFile, data }) {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: fields.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
        }, {}),
    });
    useEffect(() => {
        if (data) {
            // If no data is provided, use the sample data as default
            Object.entries(data).forEach(([key, value]) => {
                form.setValue(key, value);
            });
        }
        console.log("values are",data, form.getValues())
    }, [data, file, form]);
    return (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        {/* Dynamically Render Fields */}
                        {fields.map((field, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={field.name}
                                render={({ field: formField }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            {/* Render the appropriate input type */}
                                            {field.type === "select" ? (
                                                <select {...formField} className="input-class">
                                                    {field.options?.map((option, idx) => (
                                                        <option key={idx} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.type === "checkbox" ? (
                                                <input {...formField} type="checkbox" className="input-class" />
                                            )
                                                : field.type === 'file' ? (
                                                    <div>
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(event) => {
                                                                const file = event.target.files?.[0];
                                                                if (file) {
                                                                    formField.onChange(file);
                                                                    setFile(file);
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            file &&
                                                            <img src={URL.createObjectURL(file || './computer.png')} alt="privew" />
                                                        }
                                                    </div>
                                                )
                                                    : (
                                                        <Input
                                                            {...formField}
                                                            placeholder={field.placeholder || ""}
                                                            type={field.type || "text"}
                                                        />
                                                    )}
                                        </FormControl>
                                        {field.description && (
                                            <FormDescription>{field.description}</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        {/* Submit Button */}
                        <Button type="submit" className="w-full bg-orange-700">
                            Submit
                        </Button>
                    </form>
                </Form>
    );
}
