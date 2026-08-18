import { Customer } from "./customer.model";
import { orderLine } from "./orderLine.model";

export interface Invoice {
    // private Long idInvoice;
    // private LocalDateTime date;
    // private BigDecimal totalAmount;
    // private CustomerDTO customerDTO;
    // private List<OrderLineDTO> orderLineDTOs;
    idInvoice: number;
    date: string;
    totalAmount: number;
    orderLineDTOs: orderLine[];
}