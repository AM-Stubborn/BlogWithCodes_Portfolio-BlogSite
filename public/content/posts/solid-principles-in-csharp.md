# Understanding SOLID Principles in C#

As a C# developer, writing clean, maintainable, and scalable code is essential. SOLID principles help design software that stays modular and easier to change.

## 1. Single Responsibility Principle (SRP)

> A class should have only one reason to change.

### Problem

```csharp
public class Invoice
{
    public void GenerateInvoice() { /* ... */ }
    public void PrintInvoice() { /* ... */ }
}
```

### Better

```csharp
public class InvoiceGenerator
{
    public void GenerateInvoice() { /* ... */ }
}

public class InvoicePrinter
{
    public void PrintInvoice() { /* ... */ }
}
```

## 2. Open/Closed Principle (OCP)

> Open for extension, closed for modification.

Prefer polymorphism over growing `if/else` payment switches. New payment types implement an interface instead of editing a central processor.

## 3. Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types.

If `Penguin` cannot honor `Bird.Fly()`, redesign the hierarchy around behaviors that every subtype can fulfill (for example `Move()`).

## 4. Interface Segregation Principle (ISP)

> Clients should not depend on interfaces they do not use.

Split fat interfaces like `IWorker` into `IWorkable` and `IEatable` so robots are not forced to implement `Eat()`.

## 5. Dependency Inversion Principle (DIP)

> Depend on abstractions, not concretions.

Inject `IMessageService` into `Notification` instead of hard-coding `EmailService`.

## Conclusion

Applying SOLID makes C# codebases easier to extend with fewer regressions. Start with the principle that hurts most in your current module, then expand.

*Migrated from [Blog with Codes](https://blogwithcodes.blogspot.com/2025/04/solid-principles-in-c.html).*
